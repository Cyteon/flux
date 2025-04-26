<script lang="ts">
    import { ChevronLeft } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { getCookie } from "typescript-cookie";

    let videoElement: HTMLVideoElement | null = null;

    onMount(() => {
        videoElement!.src = `/api/media/movies/${data.id}/play`
        
        Object.defineProperty(videoElement, "duration", {
            value: 600,
        })
    });

    let { data } = $props();
</script>

<div class="flex h-screen w-full bg-black">
    <div class="m-auto flex flex-col">
        <video bind:this={videoElement} controls class="w-full h-full" autoplay></video>
    </div>

    <a href={`/movie/${data.id}`} class="absolute top-2 left-2 p-2 text-white hover:bg-black/40 rounded-full">
        <ChevronLeft class="h-8 w-8" />
    </a>
</div>