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
  import { Adjustments, Folder, Heart, Icon, X } from 'svelte-hero-icons'
  import { onMount } from "svelte";

  let bannerVisibility = 'false';
  let settings = "hidden";

  let bionic = false;
  let darkMode = import.meta.env.VITE_DARK_MODE === 'true' ?? false;

  export let authenticated: boolean;

  onMount(() => {
    bionic = localStorage.getItem("bionic") === 'true' || false;
    darkMode = localStorage.getItem("theme") === 'dark' || (import.meta.env.VITE_DARK_MODE === 'true' ?? false);

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
    localStorage.setItem('bionic', document.getElementById('bionic').checked)
    localStorage.setItem('theme', document.getElementById('dark-mode').checked ? 'dark' : 'light')

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTimeout(() => window.location.reload(), 500)
  }
</script>

<svelte:head>
  <meta name="theme-color" content="{ import.meta.env.VITE_SEO_COLOR }"/>
  <link rel="icon" href="{ import.meta.env.VITE_FAVICON }" />
</svelte:head>


<div id="container" class="py-6 px-6 md:px-44 flex flex-col w-full m-auto max-w-[2168px] bg-white dark:bg-black dark:text-white">
  {#if bannerVisibility === 'true'}
  <div id="made-with-flora" class="flex flex-row justify-between items-center w-full bg-blue-200 p-2 mb-4 text-black rounded-sm">
    <a class="flex flex-row gap-1 items-center" href="https://github.com/ShindouMihou/Flora" rel="external" target="_blank">
      <Icon src={Heart} solid class="text-red-500 w-[1.10rem] flex-shrink-0"></Icon>
      <p class="text-xs">made with <span class="uppercase font-bold">Flora</span></p>
    </a>
    <button on:click={hideFloraBanner}>
      <Icon src={X} solid class="text-black w-[1.10rem] flex-shrink-0"></Icon>
    </button>
  </div>
  {/if}
  <nav id="navigator" class="flex flex-col gap-2">
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
  <div class="flex flex-col gap-2 border rounded-lg p-2 w-full {settings}">
    <div class="flex flex-row justify-between">
      <h3 class="font-bold uppercase monst">Settings</h3>
      <button on:click={toggleSettings}>
        <Icon src={X} solid class="text-black dark:text-white w-[1.10rem] flex-shrink-0"></Icon>
      </button>
    </div>   
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-2 items-center">
        <input type="checkbox" id="bionic" class="p-4 rounded-full outline-none" bind:checked={bionic}/>
        <p>Bionic Reading</p>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <input type="checkbox" id="dark-mode" class="p-4 rounded-full outline-none" bind:checked={darkMode}/>
        <p>Dark Mode</p>
      </div>
    </div>
    <button class="bg-black text-white dark:bg-white dark:text-black p-1 mt-2" on:click={saveSettings}>Save</button>
  </div>
  <main class="py-6">
    <slot></slot>
  </main>
</div>
