import User from "$lib/models/User";
import bcrypt from "bcrypt";

export async function POST({ request }) {
    const { username, password } = await request.json();

    if (!username || !password) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 400,
        });
    }

    const userCount = await User.count();

    if (userCount > 0) {
        return new Response(
            JSON.stringify({
                error: "Setup already completed",
            }),
            {
                status: 400,
            },
        );
    }

    await User.create({
        username,
        password: await bcrypt.hash(password, 12),
        admin: true,
    });

    return new Response(
        JSON.stringify({
            error: "User created successfully",
        }),
    );
}
