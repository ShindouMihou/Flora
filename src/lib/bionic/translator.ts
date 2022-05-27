const SYMBOL_REGEX = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

export default function bionify(text: string): string {
    const contents = text.split(/(\s+)/)

    let state: "plain" | "bold" | "codespace" = "plain"
    
    return contents.map(content => {
        if (content.startsWith("**") && content.endsWith("**")) return content
        if (content.startsWith("```") && content.endsWith("```")) return content

        if (content.endsWith("**")) {
            state = "plain";
        }
        if (content.endsWith("```")) {
            state = "plain"
        }

        if (content.startsWith("**")) {
            state = "bold";
        }


        if (content.startsWith("```") && state === 'codespace') {
            state = "plain"
        } else {
            state = "codespace"
        }

        if (state === "bold" || state === "codespace") return content
        if (content.match(/(\s+)/) || content.length < 2) return content

        const substring = content.substring(0, content.length / 2);
        // symbols are not accepted in starting or ending for bold markdown according to specs.
        if ((substring.at(0)?.match(SYMBOL_REGEX) || substring.at(substring.length - 1)?.match(SYMBOL_REGEX))) {
            return content
        }

        return "**" + substring + "**" + content.substring(content.length / 2)
    }).join("")
}