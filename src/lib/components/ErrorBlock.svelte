<script lang="ts">
    import { Annotation, Icon } from "svelte-hero-icons";

    export let message: string;
</script>

<div id="error-block" class="flex flex-row justify-between items-center w-full bg-red-200 p-2 mb-4 text-black rounded-sm z-50">
    <div class="flex flex-row gap-2 items-center">
      <Icon src={Annotation} solid class="text-red-500 w-[1.10rem] flex-shrink-0"></Icon>
      <p class="text-xs">{message}</p>
    </div>
</div>