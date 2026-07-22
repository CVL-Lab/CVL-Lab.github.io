import { syncNewsContent } from "./news.mjs";
import { syncPeopleImages } from "./people.mjs";
import { syncPublicationContent } from "./publications.mjs";
import { syncPhotoContent } from "./photos.mjs";

const run = async () => {
    const publicationItems = await syncPublicationContent({
        validateOnly: true,
    });
    await syncNewsContent({ validateOnly: true, publicationItems });
    await syncPhotoContent({ validateOnly: true });
    await syncPeopleImages({ validateOnly: true });
    console.log("[content] validation completed");
};

run().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
