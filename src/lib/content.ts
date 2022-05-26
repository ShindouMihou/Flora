import emoji from 'node-emoji';

const replacer = (match: string) => emoji.emojify(match);

export function emojis(markdown: string): string {
    markdown = markdown.replace(/(:.*:)/g, replacer);

    return markdown;
}