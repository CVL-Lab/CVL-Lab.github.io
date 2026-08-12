import { syncNewsContent } from "./news.mjs";
import { syncPeopleImages } from "./people.mjs";
import { syncPublicationContent } from "./publications.mjs";
import { syncPhotoContent } from "./photos.mjs";
import { validateResearchContent } from "./research.mjs";
import { syncDeadlineContent } from "./deadlines.mjs";

const run = async () => {
    await validateResearchContent();
    const publicationItems = await syncPublicationContent({
        validateOnly: true,
    });
    await syncNewsContent({ validateOnly: true, publicationItems });
    await syncPhotoContent({ validateOnly: true });
    await syncPeopleImages({ validateOnly: true });
    await syncDeadlineContent({ validateOnly: true });
    console.log("[content] validation completed");
};

run().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
