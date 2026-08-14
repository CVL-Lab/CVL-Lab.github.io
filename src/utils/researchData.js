import RESEARCH_CATALOG from "../assets/dataset/research_areas.json";
import RESEARCH_DETAILS from "../assets/dataset/research_area_details.json";
import RESEARCH_RESOURCES from "../assets/dataset/research_resources.json";
import HOME_MEDIA from "../assets/dataset/home_media.json";
import HOME_MEDIA_IMAGES from "../assets/images/home/home_media_index";

const RESEARCH_IMAGE_MODULES = import.meta.glob(
    "../assets/images/research_concepts/optimized/*.webp",
    {
        eager: true,
        import: "default",
    },
);

const normalizeAlias = (value = "") =>
    String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/_/g, "-");

const getResearchImage = (fileName = "") =>
    RESEARCH_IMAGE_MODULES[
        `../assets/images/research_concepts/optimized/${fileName}`
    ] ?? null;

export const RESEARCH_AREA_ORDER = [
    ...(RESEARCH_CATALOG.meta?.area_order ?? []),
];

const TOPIC_META_BY_KEY = Object.fromEntries(
    RESEARCH_AREA_ORDER.map((contentKey) => {
        const area = RESEARCH_CATALOG.areas?.[contentKey] ?? {};
        const topicKey = normalizeAlias(area.slug || contentKey);

        return [
            topicKey,
            {
                contentKey,
                topicKey,
                path: `/research/${topicKey}`,
                legacyAliases: Array.isArray(area.legacy_aliases)
                    ? area.legacy_aliases
                    : [],
            },
        ];
    }),
);

const TOPIC_PATH_BY_KEY = Object.fromEntries(
    Object.entries(TOPIC_META_BY_KEY).map(([topicKey, meta]) => [
        topicKey,
        meta.path,
    ]),
);

const TOPIC_ALIAS_TO_KEY = Object.values(TOPIC_META_BY_KEY).reduce(
    (acc, meta) => {
        [
            meta.topicKey,
            meta.contentKey,
            ...(meta.legacyAliases ?? []),
        ].forEach((alias) => {
            const normalized = normalizeAlias(alias);
            if (normalized) {
                acc[normalized] = meta.topicKey;
            }
        });

        return acc;
    },
    {},
);

const CONTENT_KEY_BY_TOPIC = Object.fromEntries(
    Object.values(TOPIC_META_BY_KEY).map((meta) => [
        meta.topicKey,
        meta.contentKey,
    ]),
);

const normalizeTags = (contentItem = {}) => {
    if (Array.isArray(contentItem.tags) && contentItem.tags.length) {
        return contentItem.tags;
    }
    if (Array.isArray(contentItem.subtitle) && contentItem.subtitle.length) {
        return contentItem.subtitle;
    }
    return [];
};

export const resolveResearchTopic = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    return TOPIC_ALIAS_TO_KEY[normalizeAlias(value)] ?? null;
};

export const resolveResearchAreaKey = (value) => {
    const topicKey = resolveResearchTopic(value);
    return topicKey ? CONTENT_KEY_BY_TOPIC[topicKey] ?? null : null;
};

export const resolveResearchTopicFromPath = (pathname = "") => {
    if (typeof pathname !== "string") {
        return null;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] !== "research") {
        return null;
    }

    return resolveResearchTopic(segments[1] ?? "");
};

export const getResearchPath = (topicOrAreaKey) => {
    const topicKey = resolveResearchTopic(topicOrAreaKey);
    return topicKey ? TOPIC_PATH_BY_KEY[topicKey] : "/research";
};

export const RESEARCH_ROUTE_PATHS = RESEARCH_AREA_ORDER.map((contentKey) =>
    getResearchPath(contentKey),
);

export const RESEARCH_LEGACY_ROUTES = Object.values(TOPIC_META_BY_KEY).flatMap(
    (meta) =>
        Array.from(
            new Set(
                (meta.legacyAliases ?? [])
                    .map((alias) => normalizeAlias(alias))
                    .filter(
                        (alias) => alias && alias !== meta.topicKey,
                    ),
            ),
        ).map((alias) => ({
            from: `/research/${alias}`,
            to: meta.path,
        })),
);

export const RESEARCH_CATEGORY_LABELS = RESEARCH_AREA_ORDER.reduce(
    (labels, contentKey) => {
        const area = RESEARCH_CATALOG.areas?.[contentKey] ?? {};
        labels[contentKey] = area.title || contentKey;
        return labels;
    },
    { all: "All" },
);

export const getResearchAreas = () =>
    RESEARCH_AREA_ORDER.filter(
        (contentKey) => RESEARCH_CATALOG.areas?.[contentKey],
    ).map((contentKey, index) => {
        const base = RESEARCH_CATALOG.areas[contentKey];
        const topicKey = normalizeAlias(base.slug || contentKey);
        const details = RESEARCH_DETAILS.topics?.[contentKey] ?? {};
        const images = base.images ?? {};

        return {
            id: contentKey,
            order: index,
            contentKey,
            topicKey,
            path: TOPIC_PATH_BY_KEY[topicKey] || "/research",
            title: base.title || "Untitled Area",
            explanation: base.explanation || "",
            tags: normalizeTags(base),
            image: getResearchImage(images.default),
            imageLandscape:
                getResearchImage(images.landscape) ??
                getResearchImage(images.default),
            imageWide:
                getResearchImage(images.wide) ??
                getResearchImage(images.default),
            imageAlt:
                images.alt || `${base.title || "Research"} infographic`,
            details: {
                headline: details.headline || "",
                abstract: details.abstract || "",
                focusAreas: Array.isArray(details.focus_areas)
                    ? details.focus_areas.map((focusArea) => ({
                          title: focusArea.title || "",
                          description: focusArea.description || "",
                      }))
                    : [],
            },
        };
    });

export const getResearchResources = () =>
    (RESEARCH_RESOURCES.items ?? []).map((resource) => ({
        id: resource.id,
        label: resource.label,
        value: resource.value,
        description: resource.description,
        imageKey: resource.image_key,
        image: HOME_MEDIA_IMAGES[resource.image_key] ?? null,
        imageAlt:
            HOME_MEDIA.items?.[resource.image_key]?.alt ||
            `${resource.label} visual`,
    }));

export const getResearchResourceSummary = () =>
    RESEARCH_RESOURCES.meta?.home_summary || "";
