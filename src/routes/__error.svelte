<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = ({error, status}) => {
        return {
            props: {
                error: error?.message,
                status: status,
            }
        }
    };
</script>
<script lang="ts">
    import { Chat, ChevronDoubleRight, Icon } from "svelte-hero-icons";

    export let error: string | null;
    export let status: number;
</script>
<div class="flex flex-col">
    <div class="min-h-screen w-full bg-neutral-900 text-white p-14">
        <h1 class="text-4xl monst">ERROR {status}</h1>
        <p class="text-sm opensans">{error}</p>
        <div class="pt-4 flex flex-row gap-2 items-center">
            <Icon src={Chat} class="h-6 w-6 flex-shrink-0"></Icon>
            <p class="text-xs opensans pt-1">
                If you think this shouldn't happen, please send an issue @ 
                <a href="https://github.com/ShindouMihou/Flora/issues" class="monst text-blue-500 underline underline-offset-1">FLORA/issues</a>
            </p>
        </div>
        <div class="pt-4 flex flex-row gap-2 items-center animate-pulse">
            <Icon src={ChevronDoubleRight} class="h-6 w-6 flex-shrink-0"></Icon>
            <a href="/" class="text-xs opensans pt-1">
                Home
            </a>
        </div>
    </div>   
</div>
