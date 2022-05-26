import cookieSignature from 'cookie-signature'
import { parse } from 'cookie'
import configuration from '$lib/configuration'
import * as authenticator from '$lib/auth/authentication'

export async function handle({ event, resolve }: any) {
    const cookies = parse(event.request.headers.get('cookie') || '')
    let url = new URL(event.request.url)

    event.locals = {
        authenticated: false
    }

    if (cookies.session) {
        const session = cookieSignature.unsign(cookies.session, configuration('APP_SIGNATURE')!)

        if (session && authenticator.isValid(session)) {
            event.locals = {
                authenticated: true
            }
        }
    }

    const response = await resolve(event)

    if (!event.locals.authenticated && cookies.session && !url.pathname.toLowerCase().startsWith('/api/auth')) {
        response.headers.append('Set-Cookie', 'session=; Path=/; Max-Age=-1')
    }

    return response
}

export async function getSession(event: any) {
    return {
        authenticated: event.locals.authenticated
    }
}