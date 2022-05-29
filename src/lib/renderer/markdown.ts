import { emojis } from "$lib/content";
import hljs from "highlight.js";
import { marked } from "marked";

export interface MarkdownResult {
    error: string | undefined,
    content: string | undefined
}

const renderer = {
    heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6) {
        const escaped = text.toLowerCase().replace(/[^\w]+/g, '-');

        return (`
        <a name="${escaped}" class="flora-anchor" href="#${escaped}">
            <h${level}>
                ${text}
            </h${level}/>
        </a>
        `)
    }
}

marked.use({ renderer })

export function toHTML(text: string): MarkdownResult {
    try {
        return {
            content: marked(emojis(text), {
                smartypants: true,
                gfm: true,
                highlight: (code, lang) => {
                    if (lang == "" || !hljs.getLanguage(lang)) {
                        return hljs.highlightAuto(code).value;
                    }
    
                    return hljs.highlight(code, {
                        language: lang,
                    }).value;
                },
            }),
            error: undefined
        }
    } catch (error: any) {
        return {
            error: error.message,
            content: undefined
        }
    }
}