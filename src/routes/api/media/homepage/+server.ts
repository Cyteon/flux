import Metadata from '$lib/models/Metadata';
import { verifyRequest } from '$lib/api.server.js';

export async function GET({ request }) {
    const user = await verifyRequest(request);

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    let metadata = await Metadata.findAll();

    if (!metadata) {
        return new Response("No metadata found", { status: 404 });
    }

    metadata = metadata.map((item) => {
        const ratings = item.ratings;

        const rottenTomatoes = ratings.find((rating) => rating.Source === "Rotten Tomatoes");
        const imdb = ratings.find((rating) => rating.Source === "Internet Movie Database");

        const data = {
            id: item.id,
            title: item.title,
            year: item.year,
            runtime: item.runtime,
            poster: item.poster,
            createdAt: item.createdAt,
        }

        if (rottenTomatoes) {
            data.rottenTomatoes = rottenTomatoes.Value;
        }

        if (imdb) {
            data.imdb = imdb.Value;
        }

        return data;
    });

    const recentlyAdded = metadata
        .sort((a, b) => {
            const aDate = new Date(a.createdAt);
            const bDate = new Date(b.createdAt);

            return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 20);

    const newest = metadata
        .sort((a, b) => {
            const aDate = new Date(a.released);
            const bDate = new Date(b.released);
            return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 20);
    
    const topRated = metadata
        .sort((a, b) => {
            const aRating = parseFloat(a.imdb.split("/")[0]);
            const bRating = parseFloat(b.imdb.split("/")[0]);

            return bRating - aRating;
        })
        .slice(0, 20);
    
    return Response.json({
        recentlyAdded,
        newest,
        topRated,
    });
}