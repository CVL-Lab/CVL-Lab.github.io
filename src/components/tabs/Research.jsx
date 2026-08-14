import { useCallback, useMemo, useRef } from "react";
import "./Research.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    getResearchAreas,
    getResearchResources,
    resolveResearchTopic,
} from "../../utils/researchData";
import focusAreaSampleImage from "../../assets/images/research_concepts/optimized/focus-sample.svg";

const TAB_KEYS = new Set(["ArrowRight", "ArrowLeft", "Home", "End"]);

const normalizeText = (value) =>
    typeof value === "string" ? value.trim() : "";

const buildDetailDescription = (area) => {
    if (!area) {
        return "";
    }

    const segments = [
        area.explanation,
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
    const labResources = useMemo(() => getResearchResources(), []);

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
                                    <picture>
                                        {activeDetailArea.imageLandscape ? (
                                            <source
                                                media="(max-width: 68rem)"
                                                srcSet={
                                                    activeDetailArea.imageLandscape
                                                }
                                            />
                                        ) : null}
                                        <img
                                            src={activeDetailArea.image}
                                            alt={activeDetailArea.imageAlt}
                                            loading="lazy"
                                            decoding="async"
                                            sizes="(max-width: 68rem) 22rem, 15rem"
                                        />
                                    </picture>
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

                        <div className="research__detail-focus-areas">
                            {activeDetailArea.details.focusAreas.map(
                                (focusArea) => (
                                    <section
                                        key={focusArea.title}
                                        className="research__detail-focus-area interactive-card">
                                        <figure className="research__detail-focus-media">
                                            <img
                                                src={focusAreaSampleImage}
                                                alt=""
                                                aria-hidden="true"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </figure>
                                        <div className="research__detail-focus-copy">
                                            <h4>{focusArea.title}</h4>
                                            <p>{focusArea.description}</p>
                                        </div>
                                    </section>
                                ),
                            )}
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

            {labResources.length ? (
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
                        {labResources.map((resource, index) => (
                            <article
                                key={resource.id}
                                data-reveal
                                data-reveal-load-delay={`${120 + Math.min(index, 4) * 60}`}
                                style={{
                                    "--reveal-delay": `${Math.min(index, 4) * 60}ms`,
                                }}
                                className="research__resource-card interactive-card">
                                <div className="research__resource-media">
                                    {resource.image ? (
                                        <img
                                            src={resource.image}
                                            alt={resource.imageAlt}
                                            loading="lazy"
                                            decoding="async"
                                            sizes="(max-width: 768px) 92vw, 18rem"
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
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
export default Research;
