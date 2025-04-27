<script>
    import state from "$lib/state.svelte";
    import { removeCookie } from "typescript-cookie";
</script>

<nav class="w-full bg-ctp-mantle p-2 border-b border-ctp-surface0 flex">
    <a class="text-ctp-text text-2xl" href="/">Flux</a>

    <div class="ml-auto my-auto flex">
        {#if state.user?.admin}
            <a class="text-ctp-text hover:text-ctp-blue" href="/admin">admin</a>
        {/if}

        <p class="text-ctp-surface2 mx-2">/</p>

        <button class="text-ctp-text hover:text-ctp-blue" on:click={() => {
            state.user = null;
            removeCookie("token");
            window.location.href = "/login";
        }}>
            logout
        </button>
    </div>
</nav>