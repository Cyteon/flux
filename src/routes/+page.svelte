<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import Poster from "$lib/components/Poster.svelte";
    import { onMount } from "svelte";
    import { getCookie } from "typescript-cookie";

    let movies = {
        recentlyAdded: [],
        newest: [],
    };

    let isMediaFound: boolean = true;

    onMount(async () => {
        try {
            const res = await fetch("/api/media/homepage", {
                headers: {
                    "Authorization": `Bearer ${getCookie("token")}`,
                },
            });
            
            if (res.ok) {
                movies = await res.json();

                if (movies.recentlyAdded.length === 0) {
                    isMediaFound = false;
                }
            } else {
                console.error("Failed to fetch movies");
                isMediaFound = false;
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            isMediaFound = false;
        }
    })
</script>

<svelte:head>
    <title>Flux</title>
</svelte:head>

<div class="flex flex-col h-screen">
    <Navbar />

    {#if isMediaFound}
        <div class="p-1 px-2 md:p-4 md:px-8">
            <div>
                <h1 class="text-2xl">Recently Added</h1>
                <div class="flex mt-1">
                    {#each movies.recentlyAdded as movie}
                        <Poster {movie} />
                    {/each}
                </div>
            </div>

            <div class="mt-4">
                <h1 class="text-2xl">Newest</h1>
                <div class="flex mt-1">
                    {#each movies.newest as movie}
                        <Poster {movie} />
                    {/each}
                </div>
            </div>

            <div class="mt-4">
                <h1 class="text-2xl">Top Rated</h1>
                <div class="flex mt-1">
                    {#each movies.topRated as movie}
                        <Poster {movie} />
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <div class="flex items-center justify-center h-full">
            <h1 class="text-2xl">No media found</h1>
        </div>
    {/if}
</div>