import { verifyRequest } from '$lib/api.server.js';
import Metadata from '$lib/models/Metadata.js';
import ffmpeg from 'fluent-ffmpeg';

export async function GET({ params, request }) {
    const { id } = params;

    const user = await verifyRequest(request);

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const metadata = await Metadata.findByPk(id);

    if (!metadata) {
        return new Response("Movie not found", { status: 404 });
    }

    const filePath = metadata.filePath;

    if (!filePath) {
        return new Response("File path not found", { status: 404 });
    }

    try {
        const data = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(metadata);
                }
            });
        });
    
        if (!data) {
            return new Response("Ffprobe failed", { status: 500 });
        }

        return Response.json({
            duration: data.format.duration,
        })
    } catch (error) {
        console.error("Error during ffprobe:", error);
        return new Response("Ffprobe failed", { status: 500 });
    }
}