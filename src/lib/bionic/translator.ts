export default function bionify(text: string): string {
    const contents = text.split(/(\s+)/)

    let state: 'plain' | 'bold' | 'codespace' = 'plain'
    contents.map(content => {
        if (content.startsWith('**') && state !== 'bold') state = 'bold'
        if (content.startsWith('```') && state !== 'codespace') state = 'codespace'

        if (content.startsWith('**') && state === 'bold') state = 'plain'
        if (content.startsWith('```') && state === 'codespace') state = 'plain'

        if (state === 'bold' || state === 'codespace') return
        if (content.match(/(\s+)/) || content.length < 2) return

        return "**" + content.substring(0, content.length / 2) + "**" + content.substring(content.length / 2)
    })

    return contents.join()
}