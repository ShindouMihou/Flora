<script context="module">
    export async function load({ session }) {
        if (!session.authenticated) {
            return {
                status: 302,
                redirect: "/creator/login",
            };
        }

        return {};
    }
</script>

<script lang="ts">
    import ErrorBlock from "$lib/components/ErrorBlock.svelte";

    import PostDisplay from "$lib/components/PostDisplay.svelte";
    import PostDisplayLoading from "$lib/components/PostDisplayLoading.svelte";
    import PostDisplayNone from "$lib/components/PostDisplayNone.svelte";
    import type Post from "$lib/models/post";
    import axios from "axios";
    import { onMount } from "svelte";

    let errors: string[] = [];
    let posts: Post[] | null = null;

    onMount(() => {
        axios
            .get("/api/posts?includeDrafts")
            .then((result) => {
                const results: Post[] = result.data;

                posts = results.map((post) => {
                    post.image = post.image ?? "default.png";

                    if (post.title.length > 256) {
                        post.title = post.title.substring(0, 256);
                    }

                    return post;
                });
            })
            .catch((error) => {
                if (error.response) {
                    errors.push(
                        "Failed to request post information, received " +
                            error.response.status +
                            " with content " +
                            error.response.data.error +
                            ""
                    );
                } else if (error.request) {
                    errors.push(
                        "An internal error occurred while trying to request post information."
                    );
                } else {
                    errors.push(error.message);
                }

                errors = errors;
                console.log(error);
            });
    });
</script>

<svelte:head>
    <title>Creator Dashboard | Flora</title>
</svelte:head>

{#if errors.length > 0}
    {#each errors as error}
    <ErrorBlock message="{error}"></ErrorBlock>
    {/each}
{/if}
<div class="flex flex-col gap-4">
    <hr>
    <div>
        <h2 class="text-2xl font-bold monst uppercase">CREATOR <span class="inverse mix-blend-lighten">DASHBOARD</span></h2>
        <p class="text-lg opensans">A kingdom isn't made in one day, it was created with the sweat, efforts and tears of man.</p>
    </div>
    <a href="editor" class="w-full h-96 bg-gray-500 rounded-xl relative overflow-hidden">
        <div class="p-4 drop-shadow shadow-white">
            <h1 class="monst text-white font-bold text-4xl md:text-2xl">Make a new article.</h1>
        </div>
    </a>
    {#if posts}
        {#if posts.length > 0}
            <div id="posts" class="flex flex-col 2xl:grid 2xl:grid-cols-4 gap-4">
                {#each posts as post, i}
                <PostDisplay location="editor/" id={post._id} image={post.image ?? ""} title={post.title}></PostDisplay>
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