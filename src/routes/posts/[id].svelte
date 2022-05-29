<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ params, fetch }) => {
        try {
            const response = await fetch(`/api/posts/${params.id}`).then(
                (result) => result.json()
            );

            if (!response.error) {
                return {
                    props: {
                        title: response.title,
                        image: response.image,
                        content: response.content,
                        timestamp: new Date(response.timestamp),
                    },
                };
            } else {
                const searchResults = await fetch(
                    `/api/posts/?title=${params.id}&limit=1`
                ).then((result) => result.json());

                const firstResult = searchResults[0];
                if (!firstResult) {
                    return {
                        status: 404,
                    };
                }

                return {
                    props: {
                        title: firstResult.title,
                        image: firstResult.image,
                        content: firstResult.content,
                        timestamp: new Date(firstResult.timestamp),
                    },
                };
            }
        } catch (err: any) {
            console.error(err);
            return {
                status: 500,
                error: err,
            };
        }
    };
</script>

<script lang="ts">
    import { emojis } from "$lib/content";
    import { marked } from "marked";
    import hljs from "highlight.js";
    import PostLoading from "$lib/components/PostLoading.svelte";
    import ErrorBlock from "$lib/components/ErrorBlock.svelte";
    import removeMarkdown from "remove-markdown";
    import { fade } from "svelte/transition";
    import { ArrowUp, Icon } from "svelte-hero-icons";
    import { onMount } from "svelte";

    export let title: string;
    export let image: string;
    export let content: string;
    export let timestamp: Date;

    let errors: string[] = [];
    let metaDescription: string = removeMarkdown(content);

    let showBackToTop = false;

    const BACK_TO_TOP_FEATURE = import.meta.env.VITE_BACK_TO_TOP == null 
        ? true 
        : import.meta.env.VITE_BACK_TO_TOP === 'true';

    const DISALLOW_SELECT_CODEBLOCKS = import.meta.env.VITE_DISALLOW_SELECT_CODEBLOCKS == null 
        ? false 
        : import.meta.env.VITE_DISALLOW_SELECT_CODEBLOCKS === 'true';


    if (metaDescription.length > 162)
        metaDescription = metaDescription.slice(0, 162) + "...";

    onMount(() => {
        if (BACK_TO_TOP_FEATURE) {
            showBackToTop = window.scrollY > 300;

            window.onscroll = () => showBackToTop = window.scrollY > 300;
        }
    });

    function backToTop() {
        document.getElementById("container")!.scrollIntoView({
            behavior: "smooth"
        });
    }

    function toHTML(text: string): string {
        try {
            return marked(emojis(text), {
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
            });
        } catch (error: any) {
            errors = [error.message];
            return error.message;
        }
    }
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="image" content={image} />
    <meta name="og:image" content={image} />
    <meta name="description" content={metaDescription} />
    <meta name="og:type" content="article" />
    <meta name="article:published_time" content={timestamp.toISOString()} />
    <meta name="article:author" content={import.meta.env.VITE_DISPLAY_NAME} />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/atom-one-dark.min.css"
    />
    {#if DISALLOW_SELECT_CODEBLOCKS}
    <style>
        .mkdown pre {
            user-select: none;
            -web-kit-user-select: none;
            -ms-user-select: none;
        }
    </style>
    {/if}
</svelte:head>

{#if errors.length > 0}
    {#each errors as error}
        <ErrorBlock message={error} />
    {/each}
{/if}
{#if showBackToTop}
    <button class="fixed bottom-5 md:bottom-10 right-5 md:right-16 print:hidden" on:click={backToTop} transition:fade>
        <div class="p-3 bg-neutral-300 opacity-50 rounded-lg border border-transparent hover:border-blue-500 duration-[250ms]">
            <Icon src={ArrowUp} class="h-8 w-8 flex-shrink-0" solid />
        </div>
    </button>
{/if}
<div class="flex flex-col gap-4" id="contentContainer">
    {#if title && image && content}
        <img
            src={image}
            alt="Thumbnail"
            class="w-full h-96 object-cover rounded-lg"
        />
        <div class="flex flex-col" id="titles">
            <h1 id="postTitle" class="text-4xl font-bold monst">{title}</h1>
            <p
                id="postAuthor"
                class="text-md font-semibold monst text-gray-500"
            >
                {import.meta.env.VITE_DISPLAY_NAME} • {timestamp.toLocaleDateString(
                    "en-US",
                    {
                        dateStyle: "medium",
                    }
                )}
            </p>
        </div>
        <div class="mkdown flex flex-col gap-1 opensans">
            {@html toHTML(content)}
        </div>
    {:else}
        <PostLoading />
    {/if}
</div>
