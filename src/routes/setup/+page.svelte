<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let setupState: string = "loading";

    // account stuff
    let username: string = "";
    let password: string = "";
    let passwordConfirm: string = "";

    // location stuff
    let path: string = "";

    let error: string = "";

    onMount(async () => {
        const res = await fetch("/api/setup/init");

        if (res.status === 200) {
            setupState = "location";
        } else {
            goto("/");
        }
    })

    async function createAccount() {
        error = "";

        if (!username || !password || !passwordConfirm) {
            error = "Please fill in all fields";
            return;
        }

        if (password.length < 6) {
            error = "Password must be at least 6 characters long";
            return;
        }
        
        if (password !== passwordConfirm) {
            error = "Passwords do not match";
            return;
        }

        try {
            const res = await fetch("/api/setup/account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (res.status === 200) {
                goto("/login");
            } else {
                error = (await res.json()).error;
            }
        } catch (err) {
            error = "An error occurred. Please try again.";
        }
    }

    async function setLocation() {
        error = "";

        if (!path) {
            error = "Please fill in all fields";
            return;
        }

        try {
            const res = await fetch("/api/setup/path", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    path,
                }),
            });

            if (res.status === 200) {
                setupState = "account";
            } else {
                error = (await res.json()).error;
            }
        } catch (err) {
            error = "An error occurred. Please try again.";
        }
    }
</script>

<div class="flex h-screen w-full">
    {#if setupState === "loading"}
        <h1 class="m-auto text-3xl font-bold">Loading setup...</h1>
    {:else if setupState === "location"}
        <div class="m-auto p-4 bg-ctp-mantle rounded-md w-[95%] md:w-1/4">
            <h1 class="text-3xl font-bold mb-2">Step 1 - Set location</h1>
            <label class="text-ctp-text text-sm" for="path">Path to media folder</label>
            <input
                type="text"
                id="path"
                bind:value={path}
                class="w-full p-2 bg-ctp-crust rounded-md border border-ctp-surface0 outline-none focus:border-ctp-blue"
                placeholder="/media/movies"
            />

            <p class="text-ctp-red mt-2">{error}</p>

            <button
                onclick={setLocation}
                class="w-full p-2 bg-ctp-blue text-ctp-crust rounded-md mt-2 hover:bg-ctp-blue/80 transition duration-200"
            >
                Set location
            </button>
        </div>
    {:else if setupState === "account"}
        <div class="m-auto p-4 bg-ctp-mantle rounded-md w-[95%] md:w-1/4">
            <h1 class="text-3xl font-bold mb-2">Step 2 - Create account</h1>
            <label class="text-ctp-text text-sm" for="username">Username</label>
            <input
                type="text"
                id="username"
                bind:value={username}
                class="w-full p-2 mb-2 bg-ctp-crust rounded-md border border-ctp-surface0 outline-none focus:border-ctp-blue"
                placeholder="Enter your username"
            />

            <label class="text-ctp-text text-sm" for="password">Password</label>
            <input
                type="password"
                id="password"
                bind:value={password}
                class="w-full p-2 mb-2 bg-ctp-crust rounded-md border border-ctp-surface0 outline-none focus:border-ctp-blue"
                placeholder="Enter your password"
            />

            <label class="text-ctp-text text-sm" for="passwordConf">Confirm your password</label>
            <input
                type="password"
                id="passwordConf"
                bind:value={passwordConfirm}
                class="w-full p-2 bg-ctp-crust rounded-md border border-ctp-surface0 outline-none focus:border-ctp-blue"
                placeholder="Confirm your password"
            />

            <p class="text-ctp-red mt-2">{error}</p>

            <button
                onclick={createAccount}
                class="w-full p-2 bg-ctp-blue text-ctp-crust rounded-md mt-2 hover:bg-ctp-blue/80 transition duration-200"
            >
                Finish setup
            </button>
        </div>
    {:else}
        h
    {/if}
</div>
