<script lang="ts">
    import { emojis } from "$lib/content";
    import { marked } from 'marked';
    import hljs from 'highlight.js';
    import PostLoading from "$lib/components/PostLoading.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import axios from "axios";
    import ErrorBlock from "$lib/components/ErrorBlock.svelte";
import type Post from "$lib/models/post";

    let title = "";
    let image = "";
    let content = "";
    let errors: string[] = []

    onMount(() => {
        axios.get(`/api/posts/${$page.params.name}`).then(result => {
            const post: Post = result.data;

            title = post.title;
            image = import.meta.env.VITE_SILVA_FILE_HOST + "/" + (post.image ?? "default.png");
            content = post.content;
        }).catch(error => {
            if (error.response) {
                errors.push("Failed to request post information, received " + error.response.status + " with content " + error.response.data.error + "");
            } else if (error.request) {
                errors.push("An internal error occurred while trying to request post information.");
            } else {
                errors.push(error.message)
            }

            errors = errors
            console.log(error)

            setTimeout(() => {
                window.location.replace('/')
            }, 2500)
        })
    });
</script>


<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/atom-one-dark.min.css">
</svelte:head>

{#if errors.length > 0}
    {#each errors as error}
    <ErrorBlock message="{error}"></ErrorBlock>
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
        <h1 id="postTitle" class="text-4xl font-bold monst">{ title } </h1>
        <p id="postAuthor" class="text-lg font-semibold monst text-gray-500">by { import.meta.env.VITE_DISPLAY_NAME }</p>
    </div>    
    <div class="mkdown flex flex-col gap-4">
        {@html marked(emojis(content), {
            smartypants: true,
            gfm: true,
            highlight: (code, lang) => {
                if (lang == '') {
                    return hljs.highlightAuto(code).value;
                }

                return hljs.highlight(lang, code).value;
            }
        })}
    </div>
    {:else}
    <PostLoading></PostLoading>
    {/if}
</div>
