<script>
  import { fade } from "svelte/transition";
</script>

<div class="fixed top-5 w-full right-[0.5%] left-[0.6%] md:left-[50%] md:right-[50%] z-50" transition:fade>
  <div class="flex flex-row justify-between items-center w-[50%] bg-green-500 shadow p-3 m-auto mb-4 text-white rounded-lg">
    <div class="flex flex-row gap-2 items-center">
      <slot></slot>
    </div>
  </div>
</div>