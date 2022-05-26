import Post from "$lib/models/post";
import type { RequestEvent } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export async function get(event: RequestEvent) {

    if (!ObjectId.isValid(event.params.id)) return {
        body: {
            error: "The resource identifier requested is not valid."
        },
        status: 400
    }

    const post = await Post.withId(event.params.id)

    if (!post) return {
        status: 404
    }
    
    return {
        body: post
    }
}