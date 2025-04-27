<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { ChevronLeft, Play, Pause, VolumeX, Volume, Minimize, Maximize, Shrink, Fullscreen } from "@lucide/svelte";
    import { on } from "stream";
    import { onMount, onDestroy } from "svelte";
    import { getCookie } from "typescript-cookie";

    let { data } = $props();

    let paused: boolean = $state(true);
    let muted: boolean = $state(false);
    let volume: number = $state(1);
    let currentTime: number = $state(0);
    let duration: number = $state(0);
    let hideControlsTimeout: ReturnType<typeof setTimeout> | null = $state(null);

    let fullscreen: boolean = $state(false);
    
    function show() {
        if (browser) {
            document.getElementById("top-bar")?.classList.remove("hidden");
            document.getElementById("controls")?.classList.remove("hidden");
            document.body.style.cursor = "default";
        }
    }

    function hide() {
        if (browser) {
            document.getElementById("top-bar")?.classList.add("hidden");
            document.getElementById("controls")?.classList.add("hidden");
            document.body.style.cursor = "none";
        }
    }
    
    function handleMouseMove() {
        show();
        
        if (hideControlsTimeout) {
            clearTimeout(hideControlsTimeout);
        }
        
        hideControlsTimeout = setTimeout(() => {
            hide();
        }, 3000);
    }

    let movie = $state({});

    onMount(async () => {
        const res = await fetch(`/api/media/movies/${data.id}`, {
            headers: {
                "Authorization": `Bearer ${getCookie("token")}`,
            }
        });
        
        if (res.ok) {
            movie = await res.json();

            const probeRes = await fetch(`/api/media/movies/${data.id}/probe`, {
                headers: {
                    "Authorization": `Bearer ${getCookie("token")}`,
                }
            });

            if (probeRes.ok) {
                const probe = await probeRes.json();
                duration = probe.duration;
            } else {
                let hours = movie.runtime.split(" ")[0].replace("h", "");
                let minutes = movie.runtime.split(" ")[1].replace("m", "");

                duration = parseInt(hours) * 3600 + parseInt(minutes) * 60; 
            }
        } else {
            // we dont actually have a 404 page 
            // but it triggers +error.svelte which will show 404
            goto("/404");
        }
        
        if (browser) {
            window.addEventListener('mousemove', handleMouseMove);
            
            show();
            hideControlsTimeout = setTimeout(() => {
                hide();
            }, 3000);
        }
    });
    
    onDestroy(() => {
        if (browser) {
            window.removeEventListener('mousemove', handleMouseMove);
            
            if (hideControlsTimeout) {
                clearTimeout(hideControlsTimeout);
            }
        }
    });

    function toggleFullscreen() {
        const elem = document.documentElement;

        fullscreen = !fullscreen;

        if (fullscreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { // Firefox
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { // IE/Edge
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
</script>

<div class="flex h-screen w-full bg-black">
    <div class="m-auto flex flex-col h-full">
        <video class="w-full h-full" autoplay onclick={() => {
            paused = !paused;
        }} bind:paused={paused} bind:volume={volume} bind:muted={muted} bind:currentTime={currentTime}>
            <source src={`/api/media/movies/${data.id}/play`} type="video/mp4" />
        </video>

        <div id="controls" class="absolute bottom-0 left-0 w-full flex flex-col sm:flex-row p-2 md:p-4 bg-black/50 text-white">
            <!-- so i can move it other place if phone -->
            <button onclick={() => {
                paused = !paused;
            }} class="hover:text-ctp-blue hidden sm:block">
                {#if paused}
                    <Play class="h-8 w-8" />
                {:else}
                    <Pause class="h-8 w-8" />
                {/if}
            </button>
            
            <button onclick={toggleFullscreen} class="hover:text-ctp-blue ml-2 hidden sm:block">
                {#if fullscreen}
                    <Shrink class="h-8 w-8" />
                {:else}
                    <Fullscreen class="h-8 w-8" />
                {/if}
            </button>

            <div class="flex items-center w-full justify-center">
                <p class="text-sm text-ctp-subtext0">
                    {new Date(currentTime * 1000).toISOString().substr(11, 8)}
                </p>
                <input 
                    type="range" min="0" step="1"  max={duration}
                    bind:value={currentTime} class="w-[60%] md:w-[85%] mx-2" 
                />
                <p class="text-sm text-ctp-subtext0">{new Date(duration * 1000).toISOString().substr(11, 8)}</p>
            </div>

            <div class="flex">
                <!-- so i can move it other place if phone -->
                <button onclick={() => {
                    paused = !paused;
                }} class="hover:text-ctp-blue sm:hidden block">
                    {#if paused}
                        <Play class="h-8 w-8" />
                    {:else}
                        <Pause class="h-8 w-8" />
                    {/if}
                </button>

                <button onclick={toggleFullscreen} class="hover:text-ctp-blue ml-2 sm:hidden block">
                    {#if fullscreen}
                        <Shrink class="h-8 w-8" />
                    {:else}
                        <Fullscreen class="h-8 w-8" />
                    {/if}
                </button>
    
                <div class="flex items-center ml-auto">
                    <button onclick={() => {
                        muted = !muted;
                    }} class="hover:text-ctp-blue">
                        {#if muted}
                            <VolumeX class="h-8 w-8" />
                        {:else}
                            <Volume class="h-8 w-8" />
                        {/if}
                    </button>

                    <input type="range" min="0" max="1" step="0.01" bind:value={volume} class="w-24 md:w-32 mx-2" />
                </div> 
            </div>
        </div>
    </div>

    <div class="absolute top-0 left-0 flex w-full p-2" id="top-bar">
        <a href={`/movie/${data.id}`} class="p-2 text-white hover:bg-black/40 rounded-full">
            <ChevronLeft class="h-8 w-8" />
        </a>

        <h1 class="text-white text-2xl font-bold ml-auto my-auto pr-6">{movie.title}</h1>
    </div>
</div>