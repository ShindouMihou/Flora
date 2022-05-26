import Post from "$lib/models/post";
import { paginate } from "$lib/responses/paginator";
import type { RequestEvent } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

const POSTS_PER_REQUEST = 10;
const SORTING_ORDER = 'latest'

export async function get(event: RequestEvent) {
    if (event.url.searchParams.get('after') && ObjectId.isValid(event.url.searchParams.get('after')!)) {
        return {
            body: await paginate(Post.after(new ObjectId(event.url.searchParams.get('after')!), POSTS_PER_REQUEST, SORTING_ORDER))
        }
    }

    if (event.url.searchParams.get('before') && ObjectId.isValid(event.url.searchParams.get('before')!)) {
        return {
            body: await paginate(Post.after(new ObjectId(event.url.searchParams.get('before')!), POSTS_PER_REQUEST, SORTING_ORDER))
        }
    }

    return {
        body: await paginate(Post.all(POSTS_PER_REQUEST, SORTING_ORDER))
    }
}