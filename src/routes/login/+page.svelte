<script lang="ts">
    import { goto } from "$app/navigation";
    import state from "$lib/state.svelte";
    import { setCookie } from "typescript-cookie";

    let identifier: string = "";
    let password: string = "";
    let error: string = "";

    async function login() {
        error = "";

        if (!identifier || !password) {
            error = "Please fill in all fields.";
            return;
        }

        if (password.length < 6) {
            error = "Invalid credentials";
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            });

            if (res.status === 200) {
                const data = await res.json();
                setCookie("token", data.token, { expires: 28 });

                state.user = data.user;

                goto("/");
            } else {
                error = (await res.json()).error;
            }
        } catch (err) {
            error = "An error occurred. Please try again.";
        }
    }
</script>

<div class="flex h-screen w-full">
    <div class="m-auto p-4 bg-ctp-mantle rounded-md w-[95%] md:w-1/4">
        <h1 class="text-3xl font-bold mb-2">Login</h1>
        <label class="text-ctp-text text-sm" for="identifier">Email or Username</label>
        <input
            type="text"
            id="identifier"
            bind:value={identifier}
            class="w-full p-2 mb-2 bg-ctp-crust rounded-md border border-ctp-surface0 outline-none focus:border-ctp-blue"
            placeholder="Enter your email or username"
        />

        <label class="text-ctp-text text-sm" for="password">Password</label>
        <input
            type="password"
            id="password"
            bind:value={password}
            class="w-full p-2 bg-ctp-crust rounded-md border border-ctp-surface0 outline-none focus:border-ctp-blue"
            placeholder="Enter your password"
        />

        <p class="text-ctp-red mt-2">{error}</p>

        <button
            onclick={login}
            class="w-full p-2 bg-ctp-blue text-ctp-crust rounded-md mt-2 hover:bg-ctp-blue/80 transition duration-200"
        >
            Login
        </button>
    </div>
</div>