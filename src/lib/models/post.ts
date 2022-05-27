import bionify from "$lib/bionic/translator";
import mongo from "$lib/mongo";
import { ObjectId } from "mongodb";
import type FloraModel from "./plain";

export default class Post implements FloraModel {
    _id: string;
    image: string | null;
    title: string;
    content: string;
    bionic: string;

    constructor(_id: string, title: string, image: string | null, content: string) {
        this._id = _id;
        this.image = image;
        this.title = title;
        this.content = content;
        this.bionic = bionify(content);
    }

    /**
     * Clones this {@link Post} without the properties specified. This is more used when creating a 
     * new {@link Post} where you want MongoDB to generate the identifier.
     * 
     * @param elements The elements to exclude from the clone.
     * @returns A clone of this {@link Post} instance but without the properties or elements 
     * specified.
     */
     public without(...elements: string[]) {
        const clone: any = {}

        Object.entries(this).forEach(entry => {
            if (elements.includes(entry[0])) {
                return;
            }

            clone[entry[0]] = entry[1]
        })

        return clone
    }

    /**
     * Updates the values of the fields in this {@link Post} into another value in the database.
     * 
     * @param $set The fields to update the value to.
     * @returns The result from updating this post.
     */
    public async update($set: any) {
        return mongo.getClient().then(client => client!.db('flora').collection('posts').updateOne({
            _id: new ObjectId(this._id)
        }, {
            $set: $set
        }))
    }

    /**
     * Deletes this one {@link Post} from the database, this does not however delete any of the images linked.
     */
    public async delete() {
        return mongo.getClient().then(client => client!.db('flora').collection('posts').deleteOne({
            _id: new ObjectId(this._id)
        }))
    }

    /**
     * Gets all the posts available in the database after this {@link Post}.
     * 
     * @returns All the posts available in the database after this {@link Post}.
     */
    public async after(limit: number, sort: 'latest' | 'oldest') {
        return Post.after(new ObjectId(this._id), limit, sort)
    }

    /**
     * Gets all the posts available in the database before this {@link Post}.
     * 
     * @returns All the posts available in the database before this {@link Post}.
     */
    public async before(limit: number, sort: 'latest' | 'oldest') {
        return Post.after(new ObjectId(this._id), limit, sort)
    }

    /**
     * Gets all the posts available in the database.
     * 
     * @returns All the posts available in the database.
     */
    public static async all(limit: number, sort: 'latest' | 'oldest'): Promise<Post[]> {
        return mongo.getClient().then(client => client!.db('flora').collection('posts').find()
            .map(result => new Post(result._id.toString(), result.title, result.image, result.content))
            .limit(limit)
            .sort(
                sort === 'latest'
                ? {
                    _id: -1
                }
                : {
                    _id: 1
                }
            )
            .toArray())
    }

    /**
     * Gets all the posts available in the database after the given post.
     * 
     * @returns All the posts available in the database after the given post.
     */
    public static async after(post: ObjectId, limit: number, sort: 'latest' | 'oldest'): Promise<Post[]> {
        return mongo.getClient().then(client => client!.db('flora').collection('posts').find({
            _id: {
                $lt: post
            }
        })
        .map(result => new Post(result._id.toString(), result.title, result.image, result.content))
        .limit(limit)
        .sort(
            sort === 'latest'
            ? {
                _id: -1
            }
            : {
                _id: 1
            }
        )
        .toArray())
    }

    /**
     * Gets all the posts available in the database before the given post.
     * 
     * @returns All the posts available in the database before the given post.
    */
    public static async before(post: ObjectId, limit: number, sort: 'latest' | 'oldest'): Promise<Post[]> {
            return mongo.getClient().then(client => client!.db('flora').collection('posts').find({
                _id: {
                    $gt: post
                }
            })
            .map(result => new Post(result._id.toString(), result.title, result.image, result.content))
            .limit(limit)
            .sort(
                sort === 'latest'
                ? {
                    _id: -1
                }
                : {
                    _id: 1
                }
            )
            .toArray())
        }

    /**
     * Finds one post that matches the identifier given.
     * 
     * @param id The id of the post to get.
     * @returns A {@link Post} object with the data from the database.
     */
    public static async withId(id: string): Promise<Post | null> {
        return mongo.getClient().then(client => client!.db('flora').collection('posts').findOne({
            _id: new ObjectId(id)
        })).then(result => {
            if (result) {
                return new Post(result._id.toString(), result.title, result.image, result.content)
            }

            return null
        });
    }

    /**
     * Inserts one new post to the database that contains the given specifications, this doesn't have an image 
     * since that will be handled by the update function.
     * 
     * @param title The title of the post to create.
     * @param content The content of the post to create.
     * @returns A simple {@link Post} object.
     */
    public static async create(title: string, image: string | null, content: string): Promise<Post> {
        const post = new Post('', title, null, content)

        return mongo.getClient().then(client => client!.db('flora').collection('posts').insertOne(post.without('_id'))).then(result => {
            post._id = result.insertedId.toString();
            return post;
         })
    }

}