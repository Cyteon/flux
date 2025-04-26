import User from "$lib/models/User";
import Token from "$lib/models/Token";
import bcrypt from "bcrypt";

export async function POST({ request }) {
    const { username, password } = await request.json();

    if (!username || !password) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 400,
        });
    }

    const user = await User.findOne({
        where: {
            username,
        },
    });

    if (!user) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 401,
        });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 401,
        });
    }

    const bytes = new Uint8Array(48);
    crypto.getRandomValues(bytes);
    const token = btoa(String.fromCharCode(...bytes));

    await Token.create({
        userId: user.id,
        token,
    });

    return new Response(
        JSON.stringify({
            token,
            user: {
                username: user.username,
            },
        }),
    );
}
