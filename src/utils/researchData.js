import RESEARCH_BASE from "../assets/dataset/performance_management.json";
import RESEARCH_DETAILS from "../assets/dataset/research_area_details.json";
import RESEARCH_IMAGES from "../assets/images/research_concepts/research_concepts_image_index";

export const RESEARCH_AREA_ORDER = [
    "core_ai",
    "multi-modal_ai",
    "application_ai",
    "biomedical_ai",
];

const TOPIC_META_BY_KEY = {
    core: {
        contentKey: "core_ai",
        path: "/research/computer-vision-and-learning-algorithms",
        legacySegments: ["core"],
    },
    "multi-modal": {
        contentKey: "multi-modal_ai",
        path: "/research/efficient-learning-for-llms",
        legacySegments: ["multi-modal"],
    },
    application: {
        contentKey: "application_ai",
        path: "/research/robot-learning",
        legacySegments: ["application"],
    },
    biomedical: {
        contentKey: "biomedical_ai",
        path: "/research/industrial-and-medical-ai",
        legacySegments: ["biomedical"],
    },
};

const TOPIC_PATH_BY_KEY = Object.fromEntries(
    Object.entries(TOPIC_META_BY_KEY).map(([topicKey, meta]) => [
        topicKey,
        meta.path,
    ]),
);

const TOPIC_KEYS = Object.keys(TOPIC_PATH_BY_KEY);
const TOPIC_KEY_SET = new Set(TOPIC_KEYS);

const getSegmentFromPath = (path = "") =>
    path.split("/").filter(Boolean).at(1) || "";

const TOPIC_ALIAS_TO_KEY = Object.entries(TOPIC_META_BY_KEY).reduce(
    (acc, [topicKey, meta]) => {
        acc[topicKey] = topicKey;
        acc[getSegmentFromPath(meta.path)] = topicKey;

        (meta.legacySegments || []).forEach((segment) => {
            acc[segment] = topicKey;
        });

        return acc;
    },
    {},
);

const toTopicKey = (contentKey = "") =>
    contentKey.replace(/_ai$/i, "").replace(/_/g, "-").toLowerCase();

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

    const normalized = value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/_/g, "-");

    const canonical = normalized.replace(/-ai$/i, "");
    if (TOPIC_KEY_SET.has(canonical)) {
        return canonical;
    }

    return TOPIC_ALIAS_TO_KEY[canonical] ?? null;
};

export const resolveResearchTopicFromPath = (pathname = "") => {
    if (typeof pathname !== "string") {
        return null;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] !== "research") {
        return null;
    }

    const segment = (segments[1] ?? "").trim().toLowerCase();
    return TOPIC_ALIAS_TO_KEY[segment] ?? resolveResearchTopic(segment);
};

export const getResearchPath = (topicKey) => {
    const normalized = resolveResearchTopic(topicKey);
    if (!normalized) {
        return "/research";
    }

    return TOPIC_PATH_BY_KEY[normalized];
};

export const RESEARCH_CATEGORY_LABELS = {
    all: "All",
    core: RESEARCH_BASE.contents?.core_ai?.title || "Core",
    "multi-modal":
        RESEARCH_BASE.contents?.["multi-modal_ai"]?.title || "Multi-modal",
    application: RESEARCH_BASE.contents?.application_ai?.title || "Application",
    biomedical: RESEARCH_BASE.contents?.biomedical_ai?.title || "Biomedical",
};

export const getResearchAreas = () =>
    RESEARCH_AREA_ORDER.filter(
        (contentKey) => RESEARCH_BASE.contents[contentKey],
    ).map((contentKey, index) => {
        const base = RESEARCH_BASE.contents[contentKey] ?? {};
        const topicKey = toTopicKey(contentKey);
        const details = RESEARCH_DETAILS.topics[topicKey] ?? {};

        return {
            id: contentKey,
            order: index,
            topicKey,
            path: TOPIC_PATH_BY_KEY[topicKey] || "/research",
            title: base.title || "Untitled Area",
            explaination: base.explaination || "",
            tags: normalizeTags(base),
            image: RESEARCH_IMAGES[`${contentKey}_img`] ?? null,
            imageAlt: `${base.title || "Research"} visual`,
            details: {
                headline: details.headline || "",
                abstract: details.abstract || "",
                workstreams: Array.isArray(details.workstreams)
                    ? details.workstreams
                    : [],
                applications: Array.isArray(details.applications)
                    ? details.applications
                    : [],
                milestones: Array.isArray(details.milestones)
                    ? details.milestones
                    : [],
            },
        };
    });
