import Post from "$lib/models/post";
import FloraicResponses from "$lib/responses/basic";
import type { RequestEvent } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export async function get(event: RequestEvent) {

    if (!ObjectId.isValid(event.params.id)) return FloraicResponses.INVALID_RESOURCE_PARAMTERS;

    const post = await Post.withId(event.params.id)

    if (!post) return FloraicResponses.INVALID_RESOURCE;
    
    return {
        body: post
    }
}

const SUPPORTED_ELEMENTS = [
    "title",
    "content",
    "image"
]

export async function post(event: RequestEvent) {
    if (!event.locals.authenticated) return FloraicResponses.UNAUTHENTICATED;
    if (!ObjectId.isValid(event.params.id)) return FloraicResponses.INVALID_RESOURCE_PARAMTERS;

    const post = await Post.withId(event.params.id)

    if (!post) return FloraicResponses.INVALID_RESOURCE;

    try {
        const body = await event.request.json();

        try {
            const softClone: any = {};

            Object.entries(body)
                .filter(entry => SUPPORTED_ELEMENTS.includes(entry[0]) && entry[1] instanceof String)
                .forEach(entry => softClone[entry[0]] = entry[1]);

            if (Object.keys(softClone).length <= 0) return FloraicResponses.INVALID_REQUEST;

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

        if (!event.locals.authenticated) return FloraicResponses.UNAUTHENTICATED;
        if (!ObjectId.isValid(event.params.id)) return FloraicResponses.INVALID_RESOURCE_PARAMTERS;

        const post = await Post.withId(event.params.id)
        if (!post) return FloraicResponses.INVALID_RESOURCE;

        await post.delete()
    } catch (err: any) {
        console.error(err);
        return FloraicResponses.INTERNAL_ERROR;
    }
}