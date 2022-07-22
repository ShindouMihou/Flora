import { sign } from "$lib/auth/authentication";
import configuration from "$lib/configuration";
import FloraicResponses from "$lib/responses/basic";
import type { RequestEvent } from "@sveltejs/kit";
import cookieSignature from 'cookie-signature';

export async function POST(event: RequestEvent) {
    if (event.locals.authenticated) return FloraicResponses.UNAUTHORIZED;

    try {
        const body = await event.request.json()

        if (!body.name || !body.secret) return FloraicResponses.INVALID_REQUEST;

        try {
            if (!(configuration('ADMIN_NAME')! === body.name && configuration('ADMIN_SECRET')! === body.secret)) return { status: 400 }

            const cookie = await cookieSignature.sign(sign(), configuration('APP_SIGNATURE')!);

            return {
                status: 204,
                headers: {
                    'set-cookie': `session=${cookie}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}`
                }
            }
        } catch (error: any) {
            console.error(error)
            return FloraicResponses.INTERNAL_ERROR;
        }
    } catch (jsonError: any) {
        return FloraicResponses.INVALID_RESOURCE_CONTENT_TYPE;
    }

}