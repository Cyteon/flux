import { verifyRequest } from "$lib/api.server";

export async function GET({ request }) {
    const user = await verifyRequest(request);

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    return new Response(JSON.stringify({ username: user.username, admin: user.admin }), {
        status: 200,
    });
}
