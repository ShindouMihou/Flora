import Post from "$lib/models/post";
import FloraicResponses from "$lib/responses/basic";
import type { RequestEvent } from "@sveltejs/kit";

const POSTS_PER_REQUEST = 10;
const SORTING_ORDER = 'latest'

export async function get(event: RequestEvent) {

    // searching for titles is available but not enabled on front-end atm.
    // it's planned to have though, so please keep this till then.
    if (event.url.searchParams.get('title')) {
        return {
            body: await Post.search(event.url.searchParams.get('title')!).then(result => result.map(post => post.without("content")))
        }
    }

    return {
        body: await Post.all().then(result => result.map(post => {
            return {
                ...post.without("content"),
                timestamp: post.timestamp()
            }
        }))
    }
}
const SUPPORTED_ELEMENTS = [
    "title",
    "content",
    "image"
]

export async function put(event: RequestEvent) {
    if (!event.locals.authenticated) return FloraicResponses.UNAUTHORIZED;

    try {
        const body = await event.request.json();

        try {
            if (!(body.title && body.image && body.content) || !(typeof body.title === "string" && typeof body.image === "string" && typeof body.content === 'string'))  {
                return FloraicResponses.INVALID_REQUEST;
            }

            if (!(body.image.startsWith('https://') || body.image.startsWith('http://')))
                return FloraicResponses.INVALID_REQUEST;

            const post = await Post.create(body.title, body.image, body.content)
            
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