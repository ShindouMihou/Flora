
export async function get() {
    return {
        status: 204,
        headers: {
            'set-cookie': `session=; Path=/; HttpOnly; SameSite=Lax; Expires=-1`
        }
    }
}