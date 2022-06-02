import configuration from "$lib/configuration";
import Post from "$lib/models/post";
import type { RequestEvent } from "@sveltejs/kit";

export async function get(event: RequestEvent) {
    let origin = configuration('ORIGIN')

    if (!origin) {
        origin = event.url.origin;
    }

    return {
        body: await feedify(origin),
        headers: {
            'content-type': 'application/xml'
        }
    }
}

const feedify = async (origin: string) => {
    const posts = await Post.all(true) // always sorted by latest.

    const items = posts.map(post => itemify(origin, post)).join('\n')

    return `<?xml version="1.0" encoding="utf-8"?>
    <rss version="2.0" 
        xmlns:g="http://base.google.com/ns/1.0" 	
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
	    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	    xmlns:dc="http://purl.org/dc/elements/1.1/"
	    xmlns:atom="http://www.w3.org/2005/Atom"
	    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
	    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
    >
    <channel>
        <title>${ import.meta.env.VITE_APP_NAME }</title>
        <description>${ import.meta.env.VITE_SEO_DESCRIPTION }</description>
        <link>${ origin }</link>
        <lastBuildDate>${ posts[0].timestamp().toUTCString() }</lastBuildDate>
        ${items}
    </channel>
    </rss>
    `
}

const itemify = (origin: string, post: Post) => {
    return `
    <item>
        <title>${post.title}</title>
        <description>${post.content.split('.', 2).join('.') + "."}</description>
        <link>${formatOrigin(origin, "posts/" + post._id)}</link>
        <dc:creator>${import.meta.env.VITE_DISPLAY_NAME}</dc:creator>
        <pubDate>${ post.timestamp().toUTCString() }</pubDate>
    </item>
    `
}

const formatOrigin = (origin: string, path: string) => {
    if (origin.endsWith('/')) {
        return origin + path
    }

    return origin + "/" + path
}