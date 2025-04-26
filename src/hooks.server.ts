import { updateMetadata } from "$lib/media.server";
import ffmpegInstall from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstall.path);

(async () => {
    await updateMetadata(null);
    console.log("Metadata update complete");
})();
