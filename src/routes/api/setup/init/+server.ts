import User from "$lib/models/User";

export async function GET() {
    const users = await User.count();

    if (users > 0) {
        return new Response(
            JSON.stringify({
                error: "Database already initialized",
            }),
            {
                status: 400,
            },
        );
    }

    return new Response("Go for setup");
}
