import { updateMetadata } from "$lib/media.server";

(async () => {
    await updateMetadata(null);
    console.log("Metadata update complete");
})();
