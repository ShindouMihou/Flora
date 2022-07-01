<script lang="ts">
    import { toHTML } from "$lib/renderer/markdown";
    import axios from "axios";
    import { onMount } from "svelte";
    import {
        Beaker,
        Check,
        Cloud,
        Icon,
        Newspaper,
        Photograph,
        Save,
        Trash,
        X,
    } from "svelte-hero-icons";
    import ErrorBlock from "../ErrorBlock.svelte";
    import Block from "../Block.svelte";

    export let postId: string | null = null;
    let initialLoading = false;

    let image: string = "";
    let title: string = "";
    let content = "";
    let slug: string = "";
    let published: boolean = false;

    let translatedContent = "";
    let listenersAttached = false;

    onMount(() => {
        if (postId !== null && !initialLoading) {
            axios
                .get("/api/posts/" + postId)
                .then((result) => {
                    postId = result.data._id;
                    image = result.data.image;
                    title = result.data.title;
                    content = result.data.content;
                    published = result.data.published;
                    slug = result.data.slug ?? "";

                    let url = new URL(window.location.toString());
                    url.pathname = "/editor/" + postId;
                    window.history.pushState({}, "", url);
                    
                    initialLoading = true;
                })
                .catch((error) => {
                    let tempErrors = [];
                    if (error.response) {
                        tempErrors.push(
                            "Failed to get post information, received " +
                                error.response.status +
                                " with content " +
                                error.response.data.error +
                                ""
                        );
                    } else if (error.request) {
                        tempErrors.push(
                            "An internal error occurred while trying to get post information."
                        );
                    } else {
                        tempErrors.push(error.message);
                    }

                    errors = tempErrors;
                    console.log(error);
                });

            enableTabsOnEditor();
            enableCtrlS();
            return;
        }

        enableTabsOnEditor();
        enableCtrlS();
    });

    function enableCtrlS() {
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                save();
            }
        });
    }

    function enableTabsOnEditor() {
        if (listenersAttached) return;

        setTimeout(() => {
            listenersAttached = true;
            document
                .querySelector("textarea")!
                .addEventListener("keydown", function (event) {
                    if (event.key === "Tab") {
                        event.preventDefault();
                        const start = this.selectionStart;
                        const end = this.selectionEnd;

                        this.value =
                            this.value.substring(0, start) +
                            "\t" +
                            this.value.substring(end);
                        this.selectionStart = this.selectionEnd = start + 1;
                    }
                });
        }, 1000);
    }

    // This is a lock to prevent saving too much.
    let lock = false;
    let showSaving = false;

    // The current text modew: 0 = raw, 1 = preview.
    let mode = 0;

    $: markdownClass = mode === 0 ? "hidden" : "";
    $: textEditorClass = mode === 0 ? "" : "hidden";

    $: modeText = mode === 0 ? "Preview Mode" : "Editor Mode";

    // Settings for showing the editor, etc..
    let editorClass = "";
    let postSettingsClass = "";
    let postAdditionalSettingsClass = "";

    $: editorBottomIcon = editorClass === "hidden" ? true : false;
    $: postSettingsBottomIcon = postSettingsClass === "hidden" ? true : false;
    $: postAdditionalSettingsBottomIcon =
        postAdditionalSettingsClass === "hidden" ? true : false;

    // The amount of words calculated from the content.
    $: words = content.split(" ").length;

    let errors: string[] = [];

    function switchMode() {
        if (mode === 0) {
            const translated = toHTML(content);

            if (translated.error && !translated.content) {
                errors = [translated.error];
                translatedContent = translated.error;
            } else {
                translatedContent = translated.content!;
            }

            mode = 1;
            return;
        }

        mode = 0;
    }

    function del() {
        axios
            .delete("/api/posts/" + postId)
            .then(() => {
                setTimeout(() => window.location.replace("/creator/"), 500);
            })
            .catch((error) => {
                setTimeout(() => {
                    let tempErrors = [];
                    if (error.response) {
                        tempErrors.push(
                            "Failed to delete post, received " +
                                error.response.status +
                                " with content " +
                                error.response.data.error +
                                ""
                        );
                    } else if (error.request) {
                        tempErrors.push(
                            "An internal error occurred while trying to delete post."
                        );
                    } else {
                        tempErrors.push(error.message);
                    }

                    errors = tempErrors;
                    console.log(error);
                });
            });
    }

    function save() {
        if (!title) {
            errors = ["A title is needed before the post can be published."];
            return;
        }

        if (!image) {
            errors = ["An image is needed before the post can be published."];
            return;
        }

        if (!content) {
            errors = ["A content is needed before the post can be published."];
            return;
        }

        if (lock) {
            return;
        }

        lock = true;
        showSaving = true;

        if (postId === null) {
            axios
                .put("/api/posts", {
                    title: title,
                    image: image,
                    content: content,
                    published: published,
                    slug: slug
                })
                .then((result) => {
                    initialLoading = true;
                    postId = result.data._id;

                    let url = new URL(window.location.toString());
                    url.pathname = "/editor/" + postId;
                    window.history.pushState({}, "", url);
                    lock = false;
                    errors = []
                    setTimeout(() => (showSaving = false), 1500);
                })
                .catch((error) => {
                    setTimeout(() => {
                        lock = false;
                        setTimeout(() => (showSaving = false), 1500);
                        let tempErrors = [];
                        if (error.response) {
                            tempErrors.push(
                                "Failed to create post, received " +
                                    error.response.status +
                                    " with content " +
                                    error.response.data.error +
                                    ""
                            );
                        } else if (error.request) {
                            tempErrors.push(
                                "An internal error occurred while trying to create post."
                            );
                        } else {
                            tempErrors.push(error.message);
                        }

                        errors = tempErrors;
                        console.log(error);
                    });
                });
        } else {
            axios
                .post("/api/posts/" + postId, {
                    title: title,
                    image: image,
                    content: content,
                    published: published,
                    slug: slug
                })
                .then((result) => {
                    lock = false;
                    setTimeout(() => (showSaving = false), 1500);
                    errors = []
                })
                .catch((error) => {
                    setTimeout(() => {
                        lock = false;
                        setTimeout(() => (showSaving = false), 1500);
                        let tempErrors = [];
                        if (error.response) {
                            tempErrors.push(
                                "Failed to update information, received " +
                                    error.response.status +
                                    " with content " +
                                    error.response.data.error +
                                    ""
                            );
                        } else if (error.request) {
                            tempErrors.push(
                                "An internal error occurred while trying to update information."
                            );
                        } else {
                            tempErrors.push(error.message);
                        }

                        errors = tempErrors;
                        console.log(error);
                    }, 500);
                });
        }
    }

    function toggleEditor() {
        if (editorClass === "hidden") {
            editorClass = "";
            return;
        }

        editorClass = "hidden";
    }

    function togglePostSettings() {
        if (postSettingsClass === "hidden") {
            postSettingsClass = "";
            return;
        }

        postSettingsClass = "hidden";
    }

    function togglePostAdditionalSettings() {
        if (postAdditionalSettingsClass === "hidden") {
            postAdditionalSettingsClass = "";
            return;
        }

        postAdditionalSettingsClass = "hidden";
    }

    function togglePublished() {
        published = !published;
    }
</script>

<svelte:head>
    <title>{title || "Floraic Editor | Flora"}</title>
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
{#if showSaving}
<Block>
    <Icon src={Cloud} solid class="h-5 w-5 flex-shrink-0 animate-pulse"></Icon>
    <p class="text-xs animate-pulse">Saving...</p>
</Block>
{/if}
{#if postId !== null && !initialLoading}
    <div class="min-h-screen bg-neutral-900 text-white opensans">
        <div class="p-12 w-full h-full flex flex-col">
            <div class="flex flex-row gap-4 items-center">
                <h1 class="text-4xl monst uppercase animate-bounce">Loading</h1>
                <Icon src={Newspaper} class="h-8 w-8 animate-bounce" solid />
            </div>
            <p>
                Please wait while we are loading all the essential information
                for this post!
            </p>
        </div>
    </div>
{:else}
    <div class="flex flex-col gap-4">
        <div
            class="flex flex-col gap-2 p-4 border border-black dark:border-white opensans w-full"
        >
            <div
                class="flex flex-row gap-1 items-center hover:cursor-pointer"
                on:click={togglePostSettings}
            >
                <h4 class="monst text-xl">Settings</h4>
                {#if postSettingsBottomIcon}
                    <p>+</p>
                {:else}
                    <p>-</p>
                {/if}
            </div>
            <div class={postSettingsClass} id="settings">
                <div class="flex flex-col gap-2">
                    {#if !image}
                        <div class="w-full h-96 bg-gray-500">
                            <div class="p-4 drop-shadow shadow-white">
                                <h1
                                    class="monst text-white font-bold text-4xl md:text-2xl"
                                >
                                    {title}
                                </h1>
                            </div>
                        </div>
                    {:else}
                        <div
                            class="w-full h-96 bg-gray-500 relative overflow-hidden"
                        >
                            <div
                                class="absolute w-full h-full bg-cover inset-0 bg-center blur-sm opacity-80"
                                style="background-image: url('{image}');"
                            />
                            <div class="relative p-4 drop-shadow shadow-white">
                                <h1
                                    class="monst text-white font-bold text-4xl md:text-2xl"
                                >
                                    {title}
                                </h1>
                            </div>
                        </div>
                    {/if}
                    <input
                        type="text"
                        disabled={lock}
                        class="outline-none opensans border p-4 duration-[250ms] w-full dark:text-black dark:focus:bg-white dark:focus:text-black focus:bg-black focus:text-white"
                        placeholder="Post Title"
                        bind:value={title}
                    />
                    <input
                        type="text"
                        disabled={lock}
                        class="outline-none opensans border p-4 duration-[250ms] w-full dark:text-black dark:focus:bg-white dark:focus:text-black focus:bg-black focus:text-white"
                        placeholder="Post Image"
                        bind:value={image}
                    />
                    <input
                        type="text"
                        disabled={lock}
                        class="outline-none opensans border p-4 duration-[250ms] w-full dark:text-black dark:focus:bg-white dark:focus:text-black focus:bg-black focus:text-white"
                        placeholder="Post Slug"
                        bind:value={slug}
                    />
                </div>
                <div
                    class="flex flex-col p-2 py-4 my-2 border border-black dark:border-white"
                >
                    <div
                        class="flex flex-row gap-1 items-center hover:cursor-pointer"
                        on:click={togglePostAdditionalSettings}
                    >
                        <h4 class="monst text-md">Additional Settings</h4>
                        {#if postAdditionalSettingsBottomIcon}
                            <p class="text-md">+</p>
                        {:else}
                            <p class="text-md">-</p>
                        {/if}
                    </div>
                    <div
                        class="flex flex-col gap-2 p-2 {postAdditionalSettingsClass}"
                    >
                        <div class="flex flex-row gap-2 items-center">
                            <button on:click={togglePublished}>
                                {#if !published}
                                    <Icon
                                        src={Check}
                                        class="h-5 w-5 flex-shrink-0"
                                    />
                                {:else}
                                    <Icon
                                        src={X}
                                        class="h-5 w-5 flex-shrink-0"
                                    />
                                {/if}
                            </button>
                            <p class="monst text-sm">DRAFT</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="flex flex-col gap-2 p-4 border border-black dark:border-white opensans w-full"
        >
            <div
                class="flex flex-row gap-1 items-center hover:cursor-pointer"
                on:click={toggleEditor}
            >
                <h4 class="monst text-xl">Editor</h4>
                {#if editorBottomIcon}
                    <p>+</p>
                {:else}
                    <p>-</p>
                {/if}
            </div>
            <div class={editorClass} id="editorContainer">
                <div
                    class="dark:bg-white border border-black dark:border-white p-4"
                >
                    <div class="flex flex-row justify-between gap-4">
                        <div
                            class="flex flex-row justify-between w-full text-neutral-500 align-middle items-center"
                        >
                            <h4
                                class="text-neutral-500 font-bold text-lg uppercase m-0"
                            >
                                {words} words
                            </h4>
                            <div class="flex flex-row gap-4">
                                <button
                                    on:click={switchMode}
                                    class="flex flex-row gap-1 items-center"
                                    aria-label="Markdown/Raw Mode"
                                >
                                    <Icon
                                        src={Beaker}
                                        solid={mode === 0 ? false : true}
                                        class="h-6 w-6"
                                    />
                                    <p class="hidden md:block">
                                        {modeText}
                                    </p>
                                </button>
                                <button
                                    on:click={save}
                                    class="flex flex-row gap-1 items-center"
                                    aria-label="Save"
                                >
                                    <Icon src={Save} class="h-6 w-6" />
                                    <p class="hidden md:block">Save</p>
                                </button>
                                {#if postId !== null}
                                    <a
                                        href="/posts/{postId}"
                                        class="flex flex-row gap-1 items-center"
                                        aria-label="Open"
                                        target="_blank"
                                    >
                                        <Icon
                                            src={Photograph}
                                            class="h-6 w-6"
                                        />
                                        <p class="hidden md:block">Open</p>
                                    </a>
                                {/if}
                                {#if postId !== null}
                                    <button
                                        on:click={del}
                                        class="flex flex-row gap-1 items-center"
                                        aria-label="Save"
                                    >
                                        <Icon src={Trash} class="h-6 w-6" />
                                        <p class="hidden md:block">Delete</p>
                                    </button>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="min-h-screen bg-neutral-900 text-white dark:border dark:border-white opensans {editorClass}"
                    id="editor"
                >
                    <div class="px-6 md:px-12 flex flex-col w-full">
                        <div class="w-full py-6">
                            <h2
                                class="text-neutral-500 font-bold text-lg uppercase p-0 m-0 border-b-0 leading-none"
                            >
                                EDITOR
                            </h2>
                        </div>
                        <div
                            class="{markdownClass} text-2xl min-h-screen resize-none py-2 mkdown open-sans"
                            id="markdown"
                        >
                            {@html translatedContent}
                        </div>
                        <textarea
                            class="text-neutral-50 bg-neutral-900 outline-none text-base placeholder:text-neutral-600 min-h-screen resize-none selection:text-black selection:bg-white {textEditorClass}"
                            bind:value={content}
                            placeholder="You are who defines the limitations of what you can write."
                            id="text"
                            disabled={lock}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
