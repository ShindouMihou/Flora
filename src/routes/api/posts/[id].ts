import Post from "$lib/models/post";
import FloraicResponses from "$lib/responses/basic";
import type { RequestEvent } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export async function get(event: RequestEvent) {

    let post: Post | null;

    if (!ObjectId.isValid(event.params.id)) {
        post = await Post.withSlug(event.params.id); 
    } else {
        post = await Post.withId(event.params.id); 
    }

    if (!post) return FloraicResponses.INVALID_RESOURCE;

    return {
        body: {
            ...post,
            timestamp: post.timestamp()
        }
    }
}

const SUPPORTED_ELEMENTS = [
    "title",
    "content",
    "image",
    "slug"
]

export async function post(event: RequestEvent) {
    if (!event.locals.authenticated) return FloraicResponses.UNAUTHORIZED;
    if (!ObjectId.isValid(event.params.id)) return FloraicResponses.INVALID_RESOURCE_PARAMTERS;

    const post = await Post.withId(event.params.id)

    if (!post) return FloraicResponses.INVALID_RESOURCE;

    try {
        const body = await event.request.json();

        try {
            const softClone: any = {};

            Object.entries(body)
                .filter(entry => SUPPORTED_ELEMENTS.includes(entry[0]) && typeof entry[1] === 'string')
                .forEach(entry => softClone[entry[0]] = entry[1]);

            if (Object.keys(softClone).length <= 0) return FloraicResponses.INVALID_REQUEST;

            if (body.published != null && typeof body.published === 'boolean') {
                softClone.published = body.published;
            }

            if (softClone.slug) {
                softClone.slug = encodeURI(softClone.slug)
            }

            if (!(softClone.image.startsWith('https://') || softClone.image.startsWith('http://')))
                return FloraicResponses.INVALID_REQUEST;

            await post.update(softClone)
            
            return {
                status: 204
            }
        } catch (err: any) {
            console.error(err)
            return FloraicResponses.INTERNAL_ERROR;
        }

    } catch (jsonError: any) {
        return FloraicResponses.INVALID_RESOURCE_CONTENT_TYPE;
    }
}

export async function del(event: RequestEvent) {
    try {

        if (!event.locals.authenticated) return FloraicResponses.UNAUTHORIZED;
        if (!ObjectId.isValid(event.params.id)) return FloraicResponses.INVALID_RESOURCE_PARAMTERS;

        const post = await Post.withId(event.params.id)
        if (!post) return FloraicResponses.INVALID_RESOURCE;

        await post.delete()
        return {
            status: 204
        }
    } catch (err: any) {
        console.error(err);
        return FloraicResponses.INTERNAL_ERROR;
    }
}