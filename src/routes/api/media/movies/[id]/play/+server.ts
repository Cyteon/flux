import { verifyRequest } from '$lib/api.server.js';
import Metadata from '$lib/models/Metadata.js';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

export async function GET({ params, request, cookies }) {
    const { id } = params;

    const user = await verifyRequest(request, cookies);

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const metadata = await Metadata.findByPk(id);

    if (!metadata) {
        return new Response("No metadata found", { status: 404 });
    }


    try {
        const stream = new Readable().wrap(
            ffmpeg(metadata.filePath)
                .format('mp4')
                .videoCodec('libx264')
                .audioCodec('aac')
                .outputOptions([
                    '-movflags frag_keyframe+empty_moov',
                    '-preset ultrafast',
                    '-g 50',
                    '-sc_threshold 0'
                ])
                .pipe()
        );

        return new Response(stream, {
            headers: {
                'Content-Type': 'video/mp4',
                'Accept-Ranges': 'bytes',
                'Content-Length': metadata.size,
                'Content-Disposition': `inline; filename="${metadata.title}.mp4"`,
            },
            status: 200,
        });
    } catch (error) {
        console.error("Error processing video:", error);
        return new Response("Error processing video", { status: 500 });
    }

    // ik this is unreachable
    return new Response("An unexpected error occurred", { status: 500 });
}