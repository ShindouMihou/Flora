<script>
  import "../app.css";
  import { Heart, Icon, X } from 'svelte-hero-icons'
import { onMount } from "svelte";

  let bannerVisibility = 'false';

  onMount(() => {
    bannerVisibility = localStorage.getItem('floraBanner') ?? (import.meta.env.VITE_FLORA_BANNER ?? 'true')
  });

  function hideFloraBanner() {
    localStorage.setItem('floraBanner', 'false')
    bannerVisibility = 'false';
  }
</script>

<div id="container" class="py-6 px-6 md:px-12 flex flex-col w-full m-auto max-w-[2168px]">
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
    <div class="flex flex-row gap-2">
      <a href="/">
        <h1 class="font-bold text-2xl uppercase monst">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </a>
      <input type="text" placeholder="Find anything." class="outline-none opensans" id="search_bar"/>
    </div>
  </nav>
  <main class="py-6">
    <slot></slot>
  </main>
</div>
