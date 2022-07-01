import Post from "$lib/models/post";
import FloraicResponses from "$lib/responses/basic";
import type { RequestEvent } from "@sveltejs/kit";

const POSTS_PER_REQUEST = 10;
const SORTING_ORDER = 'latest'

export async function get(event: RequestEvent) {
    let published = true;

    if (event.url.searchParams.get('includeDrafts') != null && event.locals.authenticated) {
        published = false;
    }

    // searching for titles is available but not enabled on front-end atm.
    // it's planned to have though, so please keep this till then.
    if (event.url.searchParams.get('title')) {
        let limit: number | null = null;

        if (event.url.searchParams.get('limit') && !Number.isNaN(event.url.searchParams.get('limit')!)) {
            limit = Number.parseInt(event.url.searchParams.get('limit')!);
        }
        return {
            body: await Post.search(event.url.searchParams.get('title')!, limit, published = published).then(result => result.map(post => {
                return {
                    ...post,
                    timestamp: post.timestamp()
                }
            }))
        }
    }

    return {
        body: await Post.all(published = published).then(result => result.map(post => {
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
    "image",
    "slug"
]

export async function put(event: RequestEvent) {
    if (!event.locals.authenticated) return FloraicResponses.UNAUTHORIZED;

    try {
        const body = await event.request.json();

        try {
            if (!(body.title && body.image && body.content) || !(typeof body.title === "string" && typeof body.image === "string" && typeof body.content === 'string'))  {
                return FloraicResponses.INVALID_REQUEST;
            }

            if (body.published == null || typeof body.published !== 'boolean') {
                return FloraicResponses.INVALID_REQUEST;
            }

            if (!(body.image.startsWith('https://') || body.image.startsWith('http://')))
                return FloraicResponses.INVALID_REQUEST;

            let slug: string | null = null
            if (body.slug != null) {
                if (typeof body.slug !== 'string') return FloraicResponses.INVALID_REQUEST;
                slug = encodeURI(body.slug)
            }


            const post = await Post.create(body.title, body.image, body.content, body.published, slug)
            
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