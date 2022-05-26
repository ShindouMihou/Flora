import configuration from "$lib/configuration";
import logger from "$lib/logger";
import Post from "$lib/models/post";
import FloraicResponses from "$lib/responses/basic";
import SilvaUtils from "$lib/silva/utils";
import type { RequestEvent } from "@sveltejs/kit";
import axios from "axios";


const SUPPORTED_REQUESTS = [
    "content/image",
]

const SUPPORTED_MIMETYPES = [
    "image/jpeg",
    "image/png"
]

export async function put(event: RequestEvent) {
    if (!event.locals.authenticated) return FloraicResponses.UNAUTHENTICATED;

    try {
        const body = await event.request.json();

        if (!body.type || !body.mimetype) return FloraicResponses.INVALID_REQUEST;
        if (!SUPPORTED_MIMETYPES.includes(body.mimetype.toLowerCase())) return FloraicResponses.INVALID_REQUEST;
        if (!SUPPORTED_REQUESTS.includes(body.type.toLowerCase())) return FloraicResponses.INVALID_REQUEST;

        let mimetype: 'image/jpeg' | 'image/png' = SilvaUtils.mimetype(body.mimetype);

        let type: 'content/image' = 'content/image';

        if (type === 'content/image' && !body.postId) return FloraicResponses.INVALID_REQUEST;

        let entity: string = '';

        if (type === 'content/image' && body.postId) {
            let postId = body.postId;
            const post = await Post.withId(postId)

            if (!post) return FloraicResponses.INVALID_RESOURCE;
            entity = post._id;
        }

        let mediaServer = configuration('SILVA_HOST')

        if (!mediaServer) {
            logger.error({
                error: 'The SILVA_HOST field is not configured.'
            })

            return {
                body: {
                    error: "The media server is unavailable right now, please try again later."
                },
                status: 500
            }
        }

        if (!(mediaServer.startsWith('http://') || mediaServer.startsWith('https://'))) {
            mediaServer = 'http://' + mediaServer
        }

        try {
            const response = await axios.put(mediaServer + "/sign", SilvaUtils.createSignRequestBody(mimetype, type, configuration('ADMIN_NAME')!, entity), {
                headers: {
                    Authorization: configuration('SILVA_SECRET') || ''
                }
            })

            if (!response.data.token) {
                return {
                    body: {
                        error: "The media server is unavailable right now, please try again later."
                    },
                    status: 500
                }
            }

            return {
                body: {
                    reportTo: mediaServer + "/?token=" + response.data.token
                }
            }
        } catch (axiosError: any) {
            console.error(axiosError);
            return {
                body: {
                    error: "The media server is unavailable right now, please try again later."
                },
                status: 500
            }
        }
    } catch(jsonError: any) {
        return FloraicResponses.INVALID_RESOURCE_CONTENT_TYPE;
    }

}