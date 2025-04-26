
<script>
    import { page } from '$app/state';
</script>

<svelte:head>
    <title>Flux | {page.status} {page.error.message}</title>
</svelte:head>

<div class="flex h-screen w-full">
    <div class="m-auto flex flex-col">
        <h1 class="text-4xl font-bold text-ctp-red">
            {page.status}: {page.error.message}
        </h1>
        <a href="/" class="text-ctp-blue text-xl text-center">
            Go back to Home
        </a>
    </div>
</div>