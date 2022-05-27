
export async function get() {
    return {
        status: 302,
        headers: {
            'set-cookie': `session=; Path=/; HttpOnly; SameSite=Lax; Expires=-1`,
            'location': '/'
        }
    }
}