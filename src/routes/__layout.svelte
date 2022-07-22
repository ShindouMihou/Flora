<script context="module">
  export async function load({ session }) {
      return {
        props: {
          authenticated: session.authenticated
        }
      };
  }
</script>

<script lang="ts">
  import "../app.css";
  import { Adjustments, ArrowUp, Folder, Heart, Icon, X } from 'svelte-hero-icons'
  import { onMount } from "svelte";
  import { navigating } from "$app/stores"
  import { fade } from "svelte/transition"

  let bannerVisibility = 'false';
  let settings = "hidden";

  let darkMode = import.meta.env.VITE_DARK_MODE === 'true' ?? false;
  let focusMode = import.meta.env.VITE_FOCUS_MODE === 'true' ?? false;
  let showBackToTop = false;

  const BACK_TO_TOP_FEATURE =
        import.meta.env.VITE_BACK_TO_TOP == null
            ? true
            : import.meta.env.VITE_BACK_TO_TOP === "true";

  $: containerState = $navigating ? 'hidden' : ''
  $: loaderState = $navigating ? '' : 'hidden'

  export let authenticated: boolean;

  onMount(() => {
    if (BACK_TO_TOP_FEATURE) {
      showBackToTop = window.scrollY > 300;

      window.onscroll = () => (showBackToTop = window.scrollY > 300);
    }

    if (localStorage.getItem("focus") == null) {
      localStorage.setItem("focus", import.meta.env.VITE_FOCUS_MODE)
    }
    
    if (!localStorage.getItem("theme") == null) {
      localStorage.setItem("focus", import.meta.env.VITE_DARK_MODE === 'true' ? 'dark' : 'light')
    }

    darkMode = localStorage.getItem("theme") === 'dark';
    focusMode = localStorage.getItem("focus") === 'true';

    if (focusMode) {
			document.body.classList.add('bg-black')
		} else {
			document.body.classList.add('bg-white', 'dark:bg-black')
		}

    if (darkMode) {
			document.documentElement.classList.add('dark');
		}

    bannerVisibility = localStorage.getItem('floraBanner') ?? (import.meta.env.VITE_FLORA_BANNER ?? 'true')
  });

  function hideFloraBanner() {
    localStorage.setItem('floraBanner', 'false')
    bannerVisibility = 'false';
  }

  function toggleSettings() {
    if (settings) {
      settings = "";
      return;
    }

    settings = "hidden";
  }

  function saveSettings() {
    localStorage.setItem('theme', document.getElementById('dark-mode')!!.checked ? 'dark' : 'light')
    localStorage.setItem('focus', document.getElementById('focus-mode')!!.checked)

    setTimeout(() => window.location.reload(), 100)
  }


  function backToTop() {
        document.getElementById("container")!.scrollIntoView({
            behavior: "smooth",
        });
    }
</script>

<svelte:head>
  <meta name="theme-color" content="{ import.meta.env.VITE_SEO_COLOR }"/>
  <link rel="icon" href="{ import.meta.env.VITE_FAVICON }" />
</svelte:head>


<div id="loader" class="{loaderState} h-screen w-screen m-auto p-12 align-middle justify-center max-w-[1368px] lg:px-44 flex flex-row items-center bg-white dark:bg-black dark:text-white" transition:fade>
  <h1 class="text-5xl vibes lowercase animate-bounce dark:text-white">{import.meta.env.VITE_APP_NAME}</h1>
</div>
{#if showBackToTop}
    <button
        class="{containerState} fixed bottom-5 md:bottom-10 right-5 lg:right-16 2xl:right-72 print:hidden"
        on:click={backToTop}
        transition:fade
    >
        <div
            class="p-3 bg-neutral-300 opacity-50 rounded-lg border border-transparent hover:border-blue-500 duration-[250ms]"
        >
            <Icon src={ArrowUp} class="h-8 w-8 flex-shrink-0" solid />
        </div>
    </button>
{/if}
<div id="container" class="{containerState} min-h-screen py-6 px-6 lg:px-44 flex flex-col w-full m-auto max-w-[1368px] bg-white dark:bg-black dark:text-white">
  {#if bannerVisibility === 'true'}
  <div id="made-with-flora" class="flex flex-row justify-between items-center w-full bg-blue-200 p-2 mb-4 text-black rounded-sm print:hidden">
    <a class="flex flex-row gap-1 items-center" href="https://github.com/ShindouMihou/Flora" rel="external" target="_blank">
      <Icon src={Heart} solid class="text-red-500 w-[1.10rem] flex-shrink-0"></Icon>
      <p class="text-xs">made with <span class="uppercase font-bold">Flora</span></p>
    </a>
    <button on:click={hideFloraBanner}>
      <Icon src={X} solid class="text-black w-[1.10rem] flex-shrink-0"></Icon>
    </button>
  </div>
  {/if}
  <nav id="navigator" class="flex flex-col gap-2 print:hidden">
    <div class="flex flex-row gap-2 justify-between items-center">
      <div class="flex flex-row gap-2 flex-grow">
        <a href="/">
          <h1 class="font-bold text-2xl uppercase monst">
            {import.meta.env.VITE_APP_NAME}
          </h1>
        </a>
      </div>
      {#if authenticated}
      <a href="/creator/">
        <Icon src={Folder} class="h-6 w-6 flex-shrink-0 text-black dark:text-white my-3" solid></Icon>
      </a>
      {/if}
      <button on:click={toggleSettings}>
        <Icon src={Adjustments} class="h-6 w-6 flex-shrink-0 text-black dark:text-white my-3"></Icon>
      </button>
    </div>
  </nav>
  <div class="flex flex-col gap-2 border rounded-lg p-2 w-full {settings} print:hidden">
    <div class="flex flex-row justify-between">
      <h3 class="font-bold uppercase monst">Settings</h3>
      <button on:click={toggleSettings}>
        <Icon src={X} solid class="text-black dark:text-white w-[1.10rem] flex-shrink-0"></Icon>
      </button>
    </div>   
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2 items-center">
        <input type="checkbox" id="dark-mode" class="p-4 rounded-full outline-none" bind:checked={darkMode}/>
        <p>Dark Mode</p>
      </div>
      <div>
        <div class="flex flex-row gap-2 items-center">
          <input type="checkbox" id="focus-mode" class="p-4 rounded-full outline-none" bind:checked={focusMode}/>
          <p>Focus Mode</p>
        </div>
        <p class="text-xs 2xl:hidden dark:2xl:block text-gray-500 dark:text-gray-200 italic">Focus mode only works on 1280x720 or higher resolutions and also in light mode.</p>
      </div>
    </div>
    <button class="bg-black text-white dark:bg-white dark:text-black p-1 mt-2" on:click={saveSettings}>Save</button>
  </div>
  <main class="py-6">
    <slot></slot>
  </main>
</div>