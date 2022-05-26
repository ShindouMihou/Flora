<script lang="ts">
import ErrorBlock from '$lib/components/ErrorBlock.svelte';

    import PostDisplay from '$lib/components/PostDisplay.svelte';
import PostDisplayLoading from '$lib/components/PostDisplayLoading.svelte';
import PostDisplayNone from '$lib/components/PostDisplayNone.svelte';
    import type Post from '$lib/models/post';
    import type { PaginateResult, Paginator } from '$lib/responses/paginator';
    import axios from "axios";
    import { onMount } from 'svelte';

    let errors: string[] = [];
    let posts: Post[] | null = null;
    let paginator: Paginator | null = null;

    onMount(() => {
        axios.get('/api/posts').then(result => {
            const paginated: PaginateResult<Post> = result.data;

            posts = paginated.data.map(post => {
                post.image = import.meta.env.VITE_SILVA_FILE_HOST + "/" + (post.image ?? "default.png");
                
                if (post.title.length > 256) {
                    post.title = post.title.substring(0, 256);
                }

                return post;
            })

            paginator = paginated.paginator;
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
</script>

{#if errors.length > 0}
    {#each errors as error}
    <ErrorBlock message="{error}"></ErrorBlock>
    {/each}
{/if}
<div class="flex flex-col gap-4">
    {#if posts}
        {#if posts.length > 0}
        <PostDisplay id={posts[0]._id} image={posts[0].image ?? ""} title={posts[0].title}></PostDisplay>
            <div id="posts" class="flex flex-col 2xl:grid 2xl:grid-cols-4 gap-4">
                {#each posts as post, i}
                    {#if i !== 0}
                    <PostDisplay id={post._id} image={post.image ?? ""} title={post.title}></PostDisplay>
                    {/if}
                {/each}
            </div>
        {:else}
        <PostDisplayNone></PostDisplayNone>
        {/if}
    {:else}
    <PostDisplayLoading></PostDisplayLoading>
    <div id="posts" class="flex flex-col 2xl:grid 2xl:grid-cols-4 gap-4">
        {#each { length: 10 } as _, __}
            <PostDisplayLoading></PostDisplayLoading>
        {/each}
    </div>
    {/if}
</div>