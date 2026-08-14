import path from "node:path";
import { promises as fs } from "node:fs";
import { pathToFileURL } from "node:url";

const ROOT_DIR = process.cwd();
const RESEARCH_AREAS_FILE = path.resolve(
    ROOT_DIR,
    "src/assets/dataset/research_areas.json",
);
const RESEARCH_DETAILS_FILE = path.resolve(
    ROOT_DIR,
    "src/assets/dataset/research_area_details.json",
);
const RESEARCH_RESOURCES_FILE = path.resolve(
    ROOT_DIR,
    "src/assets/dataset/research_resources.json",
);
const HOME_MEDIA_FILE = path.resolve(
    ROOT_DIR,
    "src/assets/dataset/home_media.json",
);
const HOME_MEDIA_INDEX_FILE = path.resolve(
    ROOT_DIR,
    "src/assets/images/home/home_media_index.js",
);
const RESEARCH_IMAGE_DIR = path.resolve(
    ROOT_DIR,
    "src/assets/images/research_concepts/optimized",
);

const readJson = async (filePath) => {
    try {
        return JSON.parse(await fs.readFile(filePath, "utf8"));
    } catch (error) {
        throw new Error(
            `[research] Cannot read ${path.relative(ROOT_DIR, filePath)}: ${error.message || error}`,
        );
    }
};

const requireString = (value, location) => {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`[research] ${location} must be a non-empty string.`);
    }
};

const requireStringList = (value, location, { allowEmpty = false } = {}) => {
    if (
        !Array.isArray(value) ||
        (!allowEmpty && value.length === 0) ||
        value.some((item) => typeof item !== "string" || !item.trim())
    ) {
        throw new Error(
            `[research] ${location} must be ${allowEmpty ? "an" : "a non-empty"} array of non-empty strings.`,
        );
    }
};

const requireUnique = (values, location) => {
    if (new Set(values).size !== values.length) {
        throw new Error(`[research] ${location} contains duplicate values.`);
    }
};

const validateImages = async (areaKey, images) => {
    if (!images || typeof images !== "object" || Array.isArray(images)) {
        throw new Error(
            `[research] areas.${areaKey}.images must be an object.`,
        );
    }

    for (const variant of ["default", "landscape", "wide"]) {
        const fileName = images[variant];
        requireString(fileName, `areas.${areaKey}.images.${variant}`);

        if (
            path.basename(fileName) !== fileName ||
            path.extname(fileName).toLowerCase() !== ".webp"
        ) {
            throw new Error(
                `[research] areas.${areaKey}.images.${variant} must be a WebP filename inside the optimized research image directory.`,
            );
        }

        const imagePath = path.resolve(RESEARCH_IMAGE_DIR, fileName);
        await fs.access(imagePath).catch(() => {
            throw new Error(
                `[research] Missing image: ${path.relative(ROOT_DIR, imagePath)}`,
            );
        });
    }

    requireString(images.alt, `areas.${areaKey}.images.alt`);
};

const validateDetails = (areaKey, details) => {
    if (!details || typeof details !== "object" || Array.isArray(details)) {
        throw new Error(
            `[research] topics.${areaKey} must be a detail object.`,
        );
    }

    requireString(details.headline, `topics.${areaKey}.headline`);
    requireString(details.abstract, `topics.${areaKey}.abstract`);

    if (!Array.isArray(details.focus_areas) || !details.focus_areas.length) {
        throw new Error(
            `[research] topics.${areaKey}.focus_areas must be a non-empty array.`,
        );
    }

    const focusAreaTitles = [];
    details.focus_areas.forEach((focusArea, index) => {
        requireString(
            focusArea?.title,
            `topics.${areaKey}.focus_areas[${index}].title`,
        );
        requireString(
            focusArea?.description,
            `topics.${areaKey}.focus_areas[${index}].description`,
        );
        focusAreaTitles.push(focusArea.title);
    });
    requireUnique(focusAreaTitles, `topics.${areaKey}.focus_areas titles`);
};

export const validateResearchContent = async () => {
    const [catalog, detailCatalog, resources, homeMedia, homeMediaIndex] =
        await Promise.all([
            readJson(RESEARCH_AREAS_FILE),
            readJson(RESEARCH_DETAILS_FILE),
            readJson(RESEARCH_RESOURCES_FILE),
            readJson(HOME_MEDIA_FILE),
            fs.readFile(HOME_MEDIA_INDEX_FILE, "utf8"),
        ]);

    const areaOrder = catalog.meta?.area_order;
    const areas = catalog.areas;
    const topics = detailCatalog.topics;

    if (!Array.isArray(areaOrder) || !areaOrder.length) {
        throw new Error(
            "[research] research_areas.json meta.area_order must be a non-empty array.",
        );
    }
    requireUnique(areaOrder, "research_areas.json meta.area_order");

    if (!areas || typeof areas !== "object" || Array.isArray(areas)) {
        throw new Error(
            "[research] research_areas.json areas must be an object.",
        );
    }
    if (!topics || typeof topics !== "object" || Array.isArray(topics)) {
        throw new Error(
            "[research] research_area_details.json topics must be an object.",
        );
    }

    const areaKeys = Object.keys(areas);
    const detailKeys = Object.keys(topics);
    const missingFromOrder = areaKeys.filter(
        (areaKey) => !areaOrder.includes(areaKey),
    );
    const missingAreas = areaOrder.filter((areaKey) => !areas[areaKey]);
    const missingDetails = areaOrder.filter((areaKey) => !topics[areaKey]);
    const extraDetails = detailKeys.filter(
        (areaKey) => !areaOrder.includes(areaKey),
    );

    if (
        missingFromOrder.length ||
        missingAreas.length ||
        missingDetails.length ||
        extraDetails.length
    ) {
        throw new Error(
            `[research] Area keys must match across area_order, areas, and topics. unordered=${missingFromOrder.join(",") || "-"} missingAreas=${missingAreas.join(",") || "-"} missingDetails=${missingDetails.join(",") || "-"} extraDetails=${extraDetails.join(",") || "-"}`,
        );
    }

    const slugs = [];
    for (const areaKey of areaOrder) {
        if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(areaKey)) {
            throw new Error(
                `[research] Invalid area key "${areaKey}". Use lowercase snake_case.`,
            );
        }

        const area = areas[areaKey];
        const expectedSlug = areaKey.replace(/_/g, "-");
        requireString(area.slug, `areas.${areaKey}.slug`);
        if (area.slug !== expectedSlug) {
            throw new Error(
                `[research] areas.${areaKey}.slug must be "${expectedSlug}" so the key and route describe the same area.`,
            );
        }
        slugs.push(area.slug);

        requireString(area.title, `areas.${areaKey}.title`);
        requireString(area.explanation, `areas.${areaKey}.explanation`);
        requireStringList(area.tags, `areas.${areaKey}.tags`);
        requireStringList(area.subtitle, `areas.${areaKey}.subtitle`, {
            allowEmpty: true,
        });
        requireStringList(
            area.legacy_aliases,
            `areas.${areaKey}.legacy_aliases`,
            { allowEmpty: true },
        );
        await validateImages(areaKey, area.images);
        validateDetails(areaKey, topics[areaKey]);
    }
    requireUnique(slugs, "research area slugs");

    if (!Array.isArray(resources.items)) {
        throw new Error(
            "[research] research_resources.json items must be an array.",
        );
    }
    requireString(
        resources.meta?.home_summary,
        "research_resources.json meta.home_summary",
    );

    const resourceIds = [];
    resources.items.forEach((resource, index) => {
        const location = `resources.items[${index}]`;
        requireString(resource?.id, `${location}.id`);
        requireString(resource?.label, `${location}.label`);
        requireString(resource?.value, `${location}.value`);
        requireString(resource?.description, `${location}.description`);
        requireString(resource?.image_key, `${location}.image_key`);

        if (!homeMedia.items?.[resource.image_key]) {
            throw new Error(
                `[research] ${location}.image_key "${resource.image_key}" is not defined in home_media.json.`,
            );
        }
        const escapedImageKey = resource.image_key.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
        );
        const imageIndexPattern = new RegExp(
            `(?:^|\\n)\\s*(?:["'])?${escapedImageKey}(?:["'])?\\s*:`,
        );
        if (!imageIndexPattern.test(homeMediaIndex)) {
            throw new Error(
                `[research] ${location}.image_key "${resource.image_key}" is not connected in home_media_index.js.`,
            );
        }
        resourceIds.push(resource.id);
    });
    requireUnique(resourceIds, "research resource ids");

    console.log(
        `[research] validated ${areaOrder.length} areas and ${resources.items.length} resources`,
    );

    return {
        areaKeys: areaOrder,
        resourceCount: resources.items.length,
    };
};

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
    validateResearchContent().catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });
}
