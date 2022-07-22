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
                        id: response._id,
                        title: response.title,
                        image: response.image,
                        content: response.content,
                        timestamp: new Date(response.timestamp),
                        published: response.published,
                        slug: response.slug
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
                        id: firstResult._id,
                        title: firstResult.title,
                        image: firstResult.image,
                        content: firstResult.content,
                        timestamp: new Date(firstResult.timestamp),
                        published: firstResult.published,
                        slug: firstResult.slug
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
    import removeMarkdown from "remove-markdown";
    import { Globe, Icon } from "svelte-hero-icons";
    import { onDestroy, onMount } from "svelte";
    import { toHTML } from "$lib/renderer/markdown";
    import axios from "axios";
    import PostLoading from "$lib/components/PostLoading.svelte";
    import ErrorBlock from "$lib/components/ErrorBlock.svelte";
    import Block from "$lib/components/Block.svelte";

    export let id: string;
    export let title: string;
    export let image: string;
    export let content: string;
    export let timestamp: Date;
    export let published: boolean;
    export let slug: string | null;

    let errors: string[] = [];
    
    let cleansedContent = removeMarkdown(content);
    let metaDescription: string = cleansedContent;
    let wordCount = cleansedContent.split(/\s+/).length.toString();

    let refreshing = false;

    const DISALLOW_SELECT_CODEBLOCKS =
        import.meta.env.VITE_DISALLOW_SELECT_CODEBLOCKS == null
            ? false
            : import.meta.env.VITE_DISALLOW_SELECT_CODEBLOCKS === "true";

    const SHOW_POST_ENDING =
        import.meta.env.VITE_SHOW_POST_ENDING == null
            ? true
            : import.meta.env.VITE_SHOW_POST_ENDING === "true";

    let realtimeUpdatesInterval: NodeJS.Timer | undefined;

    // The OpenGraph specifications indicate 1-2 sentences instead of 165 characters.
    // https://ogp.me/#optional
    metaDescription = metaDescription.split('.', 2).join('.') + "."; 

    onMount(() => {
        if (slug) {
            let url = new URL(window.location.toString());
            url.pathname = "/posts/" + slug;
            window.history.pushState({}, "", url);
        }

        if (!published) {
            realtimeUpdatesInterval = setInterval(() => {
                refreshing = true;
                axios.get(`/api/posts/${id}`).then(result => {
                    setTimeout(() => {
                        if (title !== result.data.title) {
                            title = result.data.title;
                        }

                        if (content !== result.data.content) {
                            content = result.data.content;
                        }

                        if (image !== result.data.image) {
                            image = result.data.image;
                        }

                        if (result.data.slug !== '' && slug !== result.data.slug) {
                            slug = result.data.slug

                            let url = new URL(window.location.toString());
                            url.pathname = "/posts/" + slug;
                            window.history.pushState({}, "", url);
                        }

                        if (published !== result.data.published) {
                            published = result.data.published;

                            if (published && realtimeUpdatesInterval) {
                                clearInterval(realtimeUpdatesInterval);
                                realtimeUpdatesInterval = undefined;

                                console.log('The content has been published, disengaging realtime updates.')
                            }
                        }
                    
                        refreshing = false;
                    }, 2500);
                }).catch(err => {
                    errors = [
                        "Failed to request content changes for real-time updates, please reload."
                    ]
                })
            }, 7000);
        }
    });

    onDestroy(() => {
        if (realtimeUpdatesInterval) {
            clearInterval(realtimeUpdatesInterval);
            realtimeUpdatesInterval = undefined;
        }
    });

    function html(content: string) {
        const translated = toHTML(content);

        if (translated.error && !translated.content) {
            errors = [translated.error];
            return translated.error;
        }

        return translated.content!;
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
    <meta name="author" content={import.meta.env.VITE_DISPLAY_NAME} />
    <meta name="twitter:card" content="summary_large_image"/>
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
{#if refreshing}
<Block>
    <Icon src={Globe} solid class="h-5 w-5 flex-shrink-0 animate-pulse"></Icon>
    <p class="text-xs animate-pulse">Checking for new content...</p>
</Block>
{/if}
<article class="flex flex-col gap-4" id="contentContainer" itemscope itemtype="https://schema.org/Article">
    {#if title && image && content}
        <meta itemprop="wordCount" content="{wordCount}"/>
        <img
            src={image}
            itemprop="image"
            alt="Thumbnail"
            class="w-full h-96 object-cover rounded"
        />
        <div class="flex flex-col" id="titles">
            <h1 id="postTitle" class="text-4xl font-bold monst" itemprop="name">{title}</h1>
            <p
                id="postAuthor"
                class="text-md font-semibold monst text-gray-500"
            >
                <span itemprop="author">{import.meta.env.VITE_DISPLAY_NAME}</span> • {timestamp.toLocaleDateString(
                    "en-US",
                    {
                        dateStyle: "medium",
                    }
                )}
            </p>
        </div>
        <div class="mkdown flex flex-col gap-1 opensans" itemprop="articleBody">
            {@html html(content)}
        </div>
        {#if SHOW_POST_ENDING}
        <hr>
        <div class="flex flex-col">
            <h1 id="postTitleEnding" class="text-md font-semibold monst">
                {title}
            </h1>
            <p id="postAuthorEnding" class="text-xs font-semibold monst text-gray-500">
                {import.meta.env.VITE_DISPLAY_NAME}
            </p>
        </div>
        {/if}
    {:else}
        <PostLoading />
    {/if}
</article>
