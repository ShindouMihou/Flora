<script lang="ts">
    export let image: string;
    export let title: string;
    export let id: string;
</script>

<a href="/posts/{id}/" class="w-full h-96 bg-gray-500 rounded-xl relative overflow-hidden">
    <div class="absolute w-full h-full bg-cover inset-0 bg-center blur-sm opacity-80" style="background-image: url('{image}');"></div>
    <div class="relative p-4 drop-shadow shadow-white">
        <h1 class="monst text-white font-bold text-4xl md:text-2xl">{ title }</h1>
    </div>
</a>