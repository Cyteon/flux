<script lang="ts">
    let { movie } = $props();
</script>

<a href={`/movie/${movie.id}`} class="flex flex-col items-center mr-2">
    <div class="group relative">
        <img src={movie.poster} alt={movie.title} class="rounded-lg w-48" />

        <div class="absolute flex top-0 left-0 w-full h-full group-hover:opacity-100 opacity-0 bg-opacity-80 rounded-lg bg-ctp-crust">
            <div class="mt-auto mb-2 ml-3 flex flex-col">
                {#if movie.rottenTomatoes}
                    <p class="flex">🍅 <span class="mt-[1px] ml-1">{movie.rottenTomatoes}</span></p>
                {/if}
                
                {#if movie.imdb}
                    <p class="flex">⭐ <span class="mt-[1px] ml-1">{movie.imdb}</span></p>
                {/if}

                {#if movie.runtime}
                    <p class="flex">⏱️ <span class="mt-[1px] ml-1">{movie.runtime}</span></p>
                {/if}
            </div>
        </div>
    </div>

    <h2 class="text-lg mt-1 text-center">{movie.title}</h2>
    <p class="text-ctp-subtext0 mt-[-5px] text-sm text-center">{movie.year}</p>
</a>