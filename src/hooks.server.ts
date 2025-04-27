import { updateMetadata } from "$lib/media.server";
import ffmpegInstall from "@ffmpeg-installer/ffmpeg";
import ffprobeInstall from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstall.path);
ffmpeg.setFfprobePath(ffprobeInstall.path);

(async () => {
    await updateMetadata(null);
    console.log("Metadata update complete");
})();
