import { OMDb_API_KEY } from "$env/static/private";
import Settings from "./models/Settings";
import Metadata from "./models/Metadata";

import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export async function updateMetadata(path: string | null) {
    console.log("rea");

    if (!path) {
        const settings = await Settings.findByPk(1);

        if (!settings) {
            return;
        }

        const mediaPath = settings.mediaPath;

        if (!mediaPath) {
            return;
        }

        path = mediaPath;
    }

    for (const file of fs.readdirSync(path)) {
        const filePath = `${path}/${file}`;

        if (fs.statSync(filePath).isDirectory()) {
            await updateMetadata(filePath);
        } else {
            const ext = file.split(".").pop();

            // just added a bunch idk if they will work
            if (
                ext === "mp4" ||
                ext === "mkv" ||
                ext === "avi" ||
                ext === "mov" ||
                ext === "webm"
            ) {
                console.log(`Updating metadata for ${filePath}`);

                const year = /\((\d{4})\)/.exec(file);
                const imdbid = /\[imdbid-([a-zA-Z0-9]+)\]/.exec(file);

                const title = file
                    .replace(/\[imdbid-([a-zA-Z0-9]+)\]/, "")
                    .replace(/\((\d{4})\)/, "")
                    .split(".")
                    .slice(0, -1)
                    .join("")
                    .trim();

                const url = `http://www.omdbapi.com/?apikey=${OMDb_API_KEY}${year ? `&y=${year[1]}` : ""}${imdbid ? `&i=${imdbid[1]}` : `&t=${encodeURIComponent(title)}`}`;

                const res = await fetch(url);

                if (res.status !== 200) {
                    console.error(
                        `Error fetching metadata for ${filePath}: ${res.statusText}`,
                    );
                    continue;
                }

                const data = await res.json();

                if (data.Response === "False") {
                    console.error(
                        `Error fetching metadata for ${filePath}: ${data.Error}`,
                    );
                    continue;
                }

                let videoLength = "";

                await new Promise((resolve, reject) => {
                    ffmpeg.ffprobe(filePath, (err, metadata) => {
                        if (err) {
                            console.error(
                                `Error fetching video length for ${filePath}: ${err}`,
                            );

                            return resolve(null);
                        }

                        const duration = metadata.format.duration;
                        const hours = Math.floor(duration / 3600);
                        const minutes = Math.floor((duration % 3600) / 60);
                        const seconds = Math.floor(duration % 60);
                        videoLength = `${hours}h ${minutes}m ${seconds}s`;

                        resolve(null);
                    });
                });

                const hours = Math.floor(
                    parseInt(data.Runtime.split(" ")[0]) / 60,
                );
                const minutes = parseInt(data.Runtime.split(" ")[0]) % 60;

                const parsedDataRuntime = `${hours}h ${minutes}m`;

                await Metadata.upsert({
                    id: data.imdbID,
                    filePath: filePath,
                    title: data.Title,
                    year: data.Year,
                    released: data.Released,
                    runtime: videoLength || parsedDataRuntime,
                    genre: data.Genre,
                    director: data.Director,
                    writer: data.Writer,
                    actors: data.Actors,
                    plot: data.Plot,
                    awards: data.Awards,
                    poster: data.Poster,
                    ratings: data.Ratings,
                });
            }
        }
    }
}
