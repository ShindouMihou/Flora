import * as jwt from "jsonwebtoken";
import configuration from "$lib/configuration";

export function sign(): string {
    if (!configuration('APP_SECRET')) {
        throw {
            error: 'APP_SECRET is not configured, please configure it.'
        }
    }

    return jwt.sign(
        { authenticated: true }, 
        configuration("APP_SECRET")!, 
        { expiresIn: '30d' }
    )
}

export function isValid(token: string): boolean {
    return decode(token)?.authenticated || false
}

export function decode(token: string): any | null {
    if (!configuration('APP_SECRET')) {
        throw {
            error: 'APP_SECRET is not configured, please configure it.'
        }
    }

    try {
        const decoded: any = jwt.verify(token, configuration('APP_SECRET')!)
        return decoded
    } catch (err) {
        return null
    }
}