<script context="module" lang="ts">
    export async function load({ params }) {
        try {
            const response = await axios.get(`/api/posts/${params.id}`);

            return {
                props: {
                    title: response.data.title,
                    image: response.data.image,
                    content: response.data.content,
                },
            };
        } catch (err: any) {
            return {
                status: 302,
                redirect: "/",
            };
        }
    }
</script>

<script lang="ts">
    import { emojis } from "$lib/content";
    import { marked } from "marked";
    import hljs from "highlight.js";
    import PostLoading from "$lib/components/PostLoading.svelte";
    import { onMount } from "svelte";
    import axios from "axios";
    import ErrorBlock from "$lib/components/ErrorBlock.svelte";
    import DOMPurify from "dompurify";
    import bionify from "$lib/bionic/translator";
    import removeMarkdown from 'remove-markdown';

    export let title: string;
    export let image: string;
    export let content: string;

    let errors: string[] = [];
    let metaDescription: string = removeMarkdown(content);

    if (metaDescription.length > 162) metaDescription = metaDescription.slice(0, 162) + "..."

    onMount(() => {
        if (localStorage.getItem('bionic') === 'true') {
            content = bionify(content);
        }
    });
</script>

<svelte:head>
    <meta name="title" content="{title}"/>
    <meta name="image" content="{image}"/>
    <meta name="og:image" content="{image}"/>
    <meta name="description" content="{metaDescription}"/>
    <meta name="og:type" content="article"/>
    <meta name="article:author" content="{ import.meta.env.VITE_DISPLAY_NAME }"/>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/atom-one-dark.min.css"
    />
</svelte:head>

{#if errors.length > 0}
    {#each errors as error}
        <ErrorBlock message={error} />
    {/each}
{/if}
<div class="flex flex-col gap-4">
    {#if title && image && content}
        <img
            src={image}
            alt="Thumbnail"
            class="w-full h-96 object-cover rounded-lg"
        />
        <div class="flex flex-col">
            <h1 id="postTitle" class="text-4xl font-bold monst">{title}</h1>
            <p
                id="postAuthor"
                class="text-lg font-semibold monst text-gray-500"
            >
                by {import.meta.env.VITE_DISPLAY_NAME}
            </p>
        </div>
        <div class="mkdown flex flex-col gap-1 opensans">
            {@html DOMPurify.sanitize(
                marked(emojis(content), {
                    smartypants: true,
                    gfm: true,
                    highlight: (code, lang) => {
                        if (lang == "") {
                            return hljs.highlightAuto(code).value;
                        }

                        return hljs.highlight(lang, code).value;
                    },
                })
            )}
        </div>
    {:else}
        <PostLoading />
    {/if}
</div>
