import { verifyRequest } from '$lib/api.server.js';
import Metadata from '$lib/models/Metadata.js';

export async function GET({ params, request }) {
    const { id } = params;

    const user = await verifyRequest(request);

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const metadata = await Metadata.findByPk(id);

    if (!metadata) {
        return new Response("No metadata found", { status: 404 });
    }

    return Response.json(metadata);
}