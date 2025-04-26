<script lang="ts">
    import { goto } from "$app/navigation";
    import Navbar from "$lib/components/Navbar.svelte";
    import { onMount } from "svelte";
    import { getCookie } from "typescript-cookie";

    let { data } = $props();
    let movie = $state({});

    onMount(async () => {
        const res = await fetch(`/api/media/movies/${data.id}`, {
            headers: {
                "Authorization": `Bearer ${getCookie("token")}`,
            }
        });
        
        if (res.ok) {
            movie = await res.json();

            const rottenTomatoes = movie.ratings.find((rating) => rating.Source === "Rotten Tomatoes");
            const imdb = movie.ratings.find((rating) => rating.Source === "Internet Movie Database");

            if (rottenTomatoes) {
                movie.rottenTomatoes = rottenTomatoes.Value;
            }

            if (imdb) {
                movie.imdb = imdb.Value;
            }
        } else {
            // we dont actually have a 404 page 
            // but it triggers +error.svelte which will show 404
            goto("/404");
        }
    })
</script>

<svelte:head>
    <title>Flux | {movie.title}</title>
</svelte:head>

<div class="flex flex-col h-screen">
    <Navbar />

    <div class="flex flex-col md:flex-row p-1 px-2 md:p-4 md:px-5 relative">
        <img src={movie.poster} alt={movie.title} class="rounded-lg w-full md:w-64 " />

        <div class="md:ml-8">
            <h1 class="text-3xl font-bold">{movie.title}</h1>
            
            <div class="flex text-ctp-subtext0 mt-[-5px]">
                <p>{movie.year}</p>
                
                {#if movie.rottenTomatoes}
                    <p class="ml-4 md:ml-8">🍅 {movie.rottenTomatoes}</p>
                {/if}

                {#if movie.imdb}
                    <p class="ml-4 md:ml-8">⭐ {movie.imdb}</p>
                {/if}

                {#if movie.runtime}
                    <p class="ml-4 md:ml-8">⏱️ {movie.runtime}</p>
                {/if}
            </div>

            <a href={`/movie/${movie.id}/play`} class="text-ctp-subtext0 text-sm underline hover:text-ctp-blue">Watch Now</a>

            <p class="mt-4 text-ctp-subtext0">Plot</p>
            <p class="max-w-[28rem]">{movie.plot}</p>

            <p class="mt-8 text-ctp-subtext0">Genres: <span class="ml-[15px] text-ctp-text font-bold">{movie.genre}</span></p>
            <p class="mt-2 text-ctp-subtext0">Director: <span class="ml-2 text-ctp-text font-bold">{movie.director}</span></p>
            <p class="mt-2 text-ctp-subtext0">Writers: <span class="ml-[15px] text-ctp-text font-bold">{movie.writer}</span></p>
        
            <p class="mt-8 text-ctp-subtext0">Awards</p>
            <p class="text-ctp-text font-bold">{movie.awards}</p>
        </div>
    </div>
</div>