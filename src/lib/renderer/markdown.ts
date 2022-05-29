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

function displayLanguage(lang: string) {
    return (`<div class="pb-2 text-xs text-slate-400 select-none">${lang.slice(0, 1).toUpperCase() + lang.slice(1)}</div>`)
}

export function toHTML(text: string): MarkdownResult {
    try {
        return {
            content: marked(emojis(text), {
                smartypants: true,
                gfm: true,
                highlight: (code, lang) => {
                    if (lang == "" || !hljs.getLanguage(lang)) {
                        const automatic = hljs.highlightAuto(code);
                        return displayLanguage(automatic.language ?? 'unknown') + automatic.value;
                    }
    
                    return displayLanguage(lang) + hljs.highlight(code, {
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