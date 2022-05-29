<div class="w-full h-96 object-cover rounded bg-gray-600 animate-pulse" />
<div class="flex flex-col gap-1">
    <div class="w-full h-9 object-cover rounded-lg bg-gray-600 animate-pulse" />
    <div class="w-52 h-9 object-cover rounded-lg bg-gray-600 animate-pulse" />
</div>
<div class="flex flex-col gap-4">
    {#each { length: 4 } as _, __}
        <div
            class="w-full h-9 object-cover rounded-lg bg-gray-600 animate-pulse"
        />
    {/each}
</div>
