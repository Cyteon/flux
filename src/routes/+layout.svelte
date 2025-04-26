<script lang="ts">
    import "../app.css";
    import state from "$lib/state.svelte";
    import { getCookie } from "typescript-cookie";
    import { afterNavigate } from "$app/navigation";
    import { onMount } from "svelte";

    let { children } = $props();

    afterNavigate(async () => {
        const token = getCookie("token");

        if (token && !state.user) {
            const res = await fetch("/api/user", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                state!.user = data;
            } else {
                console.error("Failed to fetch user data");
            }
        }

        if (!state.user && (
            window.location.pathname !== "/login"
            && window.location.pathname !== "/setup"
        )) {
            window.location.href = "/login";
        }
    });
</script>

{@render children()}