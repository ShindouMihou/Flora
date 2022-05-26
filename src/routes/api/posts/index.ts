import Post from "$lib/models/post";
import FloraicResponses from "$lib/responses/basic";
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
const SUPPORTED_ELEMENTS = [
    "title",
    "content"
]

export async function put(event: RequestEvent) {
    if (!event.locals.authenticated) return FloraicResponses.UNAUTHENTICATED;

    try {
        const body = await event.request.json();

        try {
            const softClone: any = {};

            Object.entries(body)
                .filter(entry => SUPPORTED_ELEMENTS.includes(entry[0]) && entry[1] instanceof String)
                .forEach(entry => softClone[entry[0]] = entry[1]);

            if (Object.keys(softClone).length <= 0) return FloraicResponses.INVALID_REQUEST;

            const post = await Post.create(softClone.title, softClone.content)
            
            return {
                body: post,
                status: 200
            }
        } catch (err: any) {
            console.error(err)
            return FloraicResponses.INTERNAL_ERROR;
        }

    } catch (jsonError: any) {
        return FloraicResponses.INVALID_RESOURCE_CONTENT_TYPE;
    }
}