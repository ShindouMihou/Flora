<script lang="ts">
    import ErrorBlock from '$lib/components/ErrorBlock.svelte';

    import PostDisplay from '$lib/components/PostDisplay.svelte';
    import PostDisplayLoading from '$lib/components/PostDisplayLoading.svelte';
    import PostDisplayNone from '$lib/components/PostDisplayNone.svelte';
    import type Post from '$lib/models/post';
    import axios from "axios";
    import { onMount } from 'svelte';

    let errors: string[] = [];
    let posts: Post[] | null = null;

    onMount(() => {
        axios.get('/api/posts').then(result => {
            const results: Post[] = result.data;

            posts = results.map(post => {
                post.image = post.image ?? "default.png";
                
                if (post.title.length > 256) {
                    post.title = post.title.substring(0, 256);
                }

                return post;
            })
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
        })
    });

    function link(post: Post) {
        if (!post.slug || post.slug == '') return post._id;
        return post.slug;
    }
</script>

<svelte:head>
    <title>{import.meta.env.VITE_SEO_TITLE}</title>
    <meta name="title" content="{import.meta.env.VITE_SEO_TITLE}"/>
    <meta name="image" content="{import.meta.env.VITE_SEO_IMAGE}"/>
    <meta name="og:image" content="{import.meta.env.VITE_SEO_IMAGE}"/>
    <meta name="description" content="{import.meta.env.VITE_SEO_DESCRIPTION}"/>
    <meta name="og:type" content="website"/>
</svelte:head>

{#if errors.length > 0}
    {#each errors as error}
    <ErrorBlock message="{error}"></ErrorBlock>
    {/each}
{/if}
<div class="flex flex-col gap-4">
    {#if posts}
        {#if posts.length > 0}
        <PostDisplay id={link(posts[0])} image={posts[0].image ?? ""} title={posts[0].title}></PostDisplay>
            <div id="posts" class="flex flex-col lg:grid lg:grid-cols-2 gap-4">
                {#each posts as post, i}
                    {#if i !== 0}
                    <PostDisplay id={link(post)} image={post.image ?? ""} title={post.title}></PostDisplay>
                    {/if}
                {/each}
            </div>
        {:else}
        <PostDisplayNone></PostDisplayNone>
        {/if}
    {:else}
    <PostDisplayLoading></PostDisplayLoading>
    <div id="posts" class="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        {#each { length: 10 } as _, __}
            <PostDisplayLoading></PostDisplayLoading>
        {/each}
    </div>
    {/if}
</div>