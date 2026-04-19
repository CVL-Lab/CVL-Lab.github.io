import { useCallback, useMemo, useRef } from "react";
import "./Research.css";
import HOME_MEDIA_IMAGES from "../../assets/images/home/home_media_index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    getResearchAreas,
    resolveResearchTopic,
} from "../../utils/researchData";

const LAB_RESOURCES = [
    {
        id: "gpu",
        label: "GPU Nodes",
        value: "8× RTX 3090",
        description:
            "Dedicated training nodes for large-scale vision and learning experiments.",
        imageKey: "research_environment",
    },
    {
        id: "server",
        label: "Research Servers",
        value: "4 Shared Servers",
        description:
            "Managed compute and storage infrastructure for collaborative model development.",
        imageKey: "intro_meeting_room",
    },
    {
        id: "robotics",
        label: "Robotics Platform",
        value: "UR5e + Vision Setup",
        description:
            "Real-world testbed for embodied perception, control, and deployment workflows.",
        imageKey: "culture_discussion",
    },
];

const TAB_KEYS = new Set(["ArrowRight", "ArrowLeft", "Home", "End"]);

const normalizeText = (value) =>
    typeof value === "string" ? value.trim() : "";

const buildDetailDescription = (area) => {
    if (!area) {
        return "";
    }

    const segments = [
        area.explaination,
        area.details?.abstract,
        area.details?.headline,
    ]
        .map((item) => normalizeText(item))
        .filter(Boolean);

    return Array.from(new Set(segments)).join(" ");
};

function Research({ selectedResearchTopic }) {
    const navigate = useNavigate();
    const location = useLocation();
    const tabRefs = useRef({});
    const researchContents = useMemo(() => getResearchAreas(), []);

    const activeDetailTopic = useMemo(() => {
        const fromProps = resolveResearchTopic(selectedResearchTopic);
        if (fromProps) {
            return fromProps;
        }
        return researchContents[0]?.topicKey ?? null;
    }, [selectedResearchTopic, researchContents]);

    const activeDetailIndex = useMemo(
        () =>
            researchContents.findIndex(
                (item) => item.topicKey === activeDetailTopic,
            ),
        [researchContents, activeDetailTopic],
    );

    const activeDetailArea =
        activeDetailIndex >= 0
            ? researchContents[activeDetailIndex]
            : (researchContents[0] ?? null);

    const activeDetailDescription = useMemo(
        () => buildDetailDescription(activeDetailArea),
        [activeDetailArea],
    );

    const areaPathByTopic = useMemo(
        () =>
            researchContents.reduce((acc, item) => {
                acc[item.topicKey] = item.path;
                return acc;
            }, {}),
        [researchContents],
    );

    const navigateToArea = useCallback(
        (topicKey, focusAfterNavigation = false) => {
            const normalizedTopic = resolveResearchTopic(topicKey);
            if (!normalizedTopic) {
                return;
            }

            const nextPath = areaPathByTopic[normalizedTopic] || "/research";
            if (location.pathname === nextPath) {
                return;
            }

            navigate(nextPath, {
                state: {
                    scroll: {
                        mode: "preserve",
                    },
                },
            });

            if (focusAfterNavigation && typeof window !== "undefined") {
                window.requestAnimationFrame(() => {
                    tabRefs.current[normalizedTopic]?.focus();
                });
            }
        },
        [navigate, areaPathByTopic, location.pathname],
    );

    const handleTabKeyDown = useCallback(
        (event, index) => {
            if (!TAB_KEYS.has(event.key) || !researchContents.length) {
                return;
            }

            event.preventDefault();
            let nextIndex = index;

            if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % researchContents.length;
            } else if (event.key === "ArrowLeft") {
                nextIndex =
                    (index - 1 + researchContents.length) %
                    researchContents.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = researchContents.length - 1;
            }

            const nextTopic = researchContents[nextIndex]?.topicKey;
            if (nextTopic) {
                navigateToArea(nextTopic, true);
            }
        },
        [researchContents, navigateToArea],
    );

    return (
        <div
            data-reveal
            data-reveal-load-delay="60"
            className="research-wrapper">
            <div
                data-reveal
                className="tab-header page-head page-head--research">
                <h1>Research</h1>
                <p className="page-head__summary">
                    From foundational algorithms to real-world deployment,
                    CVL-Lab builds vision and learning systems that connect core
                    research, multimodal intelligence, robotics, and biomedical
                    impact.
                </p>
            </div>

            <section
                data-reveal
                className="research__details page-panel page-panel--section-start"
                aria-live="polite"
                aria-labelledby="research-area-details-title">
                <div className="research__section-head research__section-head--areas">
                    <div>
                        <h2 id="research-area-details-title">
                            Research Area Details
                        </h2>
                        <p>
                            Explore each area through abstract, keywords, active
                            workstreams, and near-term milestones.
                        </p>
                    </div>
                </div>

                <div
                    className="research__detail-tabs"
                    role="tablist"
                    aria-label="Research area details tabs">
                    {researchContents.map((contentItem, index) => {
                        const isActive =
                            activeDetailArea?.topicKey === contentItem.topicKey;

                        return (
                            <button
                                key={contentItem.topicKey}
                                type="button"
                                ref={(node) => {
                                    if (node) {
                                        tabRefs.current[contentItem.topicKey] =
                                            node;
                                    }
                                }}
                                role="tab"
                                id={`research-tab-${contentItem.topicKey}`}
                                aria-selected={isActive}
                                aria-controls={`research-panel-${contentItem.topicKey}`}
                                tabIndex={isActive ? 0 : -1}
                                className={`research__detail-tab btn btn--secondary btn--sm interactive-button ${
                                    isActive ? "is-active" : ""
                                }`}
                                onClick={() =>
                                    navigateToArea(contentItem.topicKey)
                                }
                                onKeyDown={(event) =>
                                    handleTabKeyDown(event, index)
                                }>
                                {contentItem.title}
                            </button>
                        );
                    })}
                </div>

                {activeDetailArea ? (
                    <article
                        key={activeDetailArea.topicKey}
                        id={`research-panel-${activeDetailArea.topicKey}`}
                        role="tabpanel"
                        aria-labelledby={`research-tab-${activeDetailArea.topicKey}`}
                        className="research__detail-panel">
                        <div className="research__detail-hero">
                            <figure className="research__detail-media">
                                {activeDetailArea.image ? (
                                    <img
                                        src={activeDetailArea.image}
                                        alt={activeDetailArea.imageAlt}
                                    />
                                ) : (
                                    <div className="research__detail-media-placeholder">
                                        Image placeholder
                                    </div>
                                )}
                            </figure>

                            <header className="research__detail-panel-head">
                                <p className="research__detail-kicker">
                                    Abstract
                                </p>
                                <h3>{activeDetailArea.title}</h3>
                                {activeDetailDescription ? (
                                    <p className="research__detail-description">
                                        {activeDetailDescription}
                                    </p>
                                ) : null}
                                <div className="research__detail-keywords-group">
                                    <div
                                        className="research__detail-keywords"
                                        aria-label={`${activeDetailArea.title} keywords`}>
                                        {activeDetailArea.tags.map(
                                            (keywordItem) => (
                                                <span
                                                    key={`${activeDetailArea.topicKey}-${keywordItem}`}
                                                    className="research__detail-keyword-chip">
                                                    {keywordItem}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </header>
                        </div>

                        <div className="research__detail-body">
                            <section className="research__detail-block">
                                <h4>Current Workstreams</h4>
                                <div className="research__detail-workstreams">
                                    {activeDetailArea.details.workstreams.map(
                                        (workstream) => (
                                            <article
                                                key={workstream.title}
                                                className="research__detail-workstream-card interactive-card">
                                                <h5>{workstream.title}</h5>
                                                <p>{workstream.description}</p>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className="research__detail-block">
                                <h4>Application Directions</h4>
                                <ul className="research__detail-list">
                                    {activeDetailArea.details.applications.map(
                                        (item) => (
                                            <li key={item}>{item}</li>
                                        ),
                                    )}
                                </ul>
                            </section>

                            <section className="research__detail-block">
                                <h4>Near-term Milestones</h4>
                                <ol className="research__detail-list research__detail-list--ordered">
                                    {activeDetailArea.details.milestones.map(
                                        (item) => (
                                            <li key={item}>{item}</li>
                                        ),
                                    )}
                                </ol>
                            </section>
                        </div>
                    </article>
                ) : null}

                <div className="research__section-footer">
                    <Link
                        to="/publication"
                        className="btn btn--tertiary animated-underline">
                        Browse all publications
                    </Link>
                </div>
            </section>

            <section
                data-reveal
                className="research__resources page-panel"
                aria-labelledby="research-resources-title">
                <div className="research__section-head">
                    <div>
                        <h2 id="research-resources-title">
                            Lab Resources & Infrastructure
                        </h2>
                        <p>
                            Core infrastructure that supports training,
                            experimentation, and deployment.
                        </p>
                    </div>
                </div>
                <div className="research__resources-grid">
                    {LAB_RESOURCES.map((resource, index) => {
                        const imageSrc =
                            HOME_MEDIA_IMAGES[resource.imageKey] ?? null;

                        return (
                            <article
                                key={resource.id}
                                data-reveal
                                data-reveal-load-delay={`${120 + Math.min(index, 4) * 60}`}
                                style={{
                                    "--reveal-delay": `${Math.min(index, 4) * 60}ms`,
                                }}
                                className="research__resource-card interactive-card">
                                <div className="research__resource-media">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt={`${resource.label} visual`}
                                        />
                                    ) : (
                                        <div className="research__resource-media-placeholder">
                                            Image placeholder
                                        </div>
                                    )}
                                </div>
                                <div className="research__resource-copy">
                                    <p className="research__resource-label">
                                        {resource.label}
                                    </p>
                                    <p className="research__resource-value">
                                        {resource.value}
                                    </p>
                                    <p className="research__resource-description">
                                        {resource.description}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
export default Research;
