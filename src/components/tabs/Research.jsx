import { useMemo } from "react";
import "./Research.css";
import ResearchCard from "./Research.Card";
import CONTENTS from "../../assets/dataset/performance_management.json";
import CONTENT_IMGS from "../../assets/images/research_concepts/research_concepts_image_index";
import HOME_MEDIA_IMAGES from "../../assets/images/home/home_media_index";
import { Link } from "react-router-dom";
import {
    aggregatePublications,
    getPublicationCategories,
    getHomeMediaBySection,
} from "./home/homeData";

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

function Research({ selectedResearchTopic }) {
    const publications = useMemo(() => aggregatePublications(), []);
    const publicationCategories = useMemo(
        () => new Set(getPublicationCategories()),
        [],
    );

    const publicationCountByCategory = useMemo(
        () =>
            publications.reduce((acc, item) => {
                const category = item.category;
                acc[category] = (acc[category] ?? 0) + 1;
                return acc;
            }, {}),
        [publications],
    );

    const researchContents = useMemo(
        () =>
            Object.entries(CONTENTS.contents).map(
                ([contentKey, contentItem], index) => {
                    const topicKey = contentKey
                        .replace(/_ai$/i, "")
                        .replace(/_/g, "-")
                        .toLowerCase();

                    return {
                        ...contentItem,
                        order: index,
                        topicKey,
                        publicationCategory: topicKey,
                        hasPublicationCategory:
                            publicationCategories.has(topicKey),
                        publicationCount:
                            publicationCountByCategory[topicKey] ?? 0,
                        image: CONTENT_IMGS[`${contentKey}_img`] ?? null,
                    };
                },
            ),
        [publicationCategories, publicationCountByCategory],
    );
    const researchMedia = useMemo(
        () => getHomeMediaBySection("research", 1)[0],
        [],
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
                    CVL-Lab explores core vision, learning, biomedical, and
                    applied AI with a connected workflow from ideas to
                    publications and people.
                </p>
            </div>

            <section
                data-reveal
                className="research__intro page-panel page-panel--section-start"
                aria-labelledby="research-overview-title">
                <div className="research__intro-copy-wrap">
                    <div className="research__section-head research__intro-head">
                        <div>
                            <h2 id="research-overview-title">
                                Connected overview
                            </h2>
                            <p className="research__intro-copy">
                                Research is organized by focused areas and
                                linked directly to publication outputs, so
                                visitors can move from themes to evidence
                                quickly.
                            </p>
                        </div>
                    </div>
                    <div className="research__intro-metrics">
                        <span>{researchContents.length} active areas</span>
                        <span>{publications.length} total publications</span>
                    </div>
                    <div className="research__intro-actions">
                        <Link
                            to="/publication"
                            className="btn btn--secondary btn--sm interactive-button">
                            View all publications
                        </Link>
                    </div>
                </div>
                {researchMedia ? (
                    <figure className="research__intro-media">
                        {researchMedia.image ? (
                            <img
                                src={researchMedia.image}
                                alt={researchMedia.alt || researchMedia.title}
                            />
                        ) : (
                            <div className="research__intro-media-placeholder">
                                Image placeholder
                            </div>
                        )}
                        <figcaption>
                            <strong>{researchMedia.title}</strong>
                            <span>{researchMedia.description}</span>
                        </figcaption>
                    </figure>
                ) : null}
            </section>

            <section
                data-reveal
                className="research__areas page-panel"
                aria-labelledby="research-areas-title">
                <div className="research__section-head research__section-head--areas">
                    <div>
                        <h2 id="research-areas-title">Research Areas</h2>
                        <p>
                            Each area summarizes focus, key methods, and direct
                            links to related outputs.
                        </p>
                    </div>
                </div>
                <div className="research-card-wrapper">
                    {researchContents.map((contentItem, index) => (
                        <ResearchCard
                            key={contentItem.topicKey}
                            {...contentItem}
                            isSelected={
                                contentItem.topicKey === selectedResearchTopic
                            }
                            revealDelay={`${Math.min(index, 5) * 60}ms`}
                            revealLoadDelay={`${140 + Math.min(index, 5) * 60}`}
                        />
                    ))}
                </div>
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
