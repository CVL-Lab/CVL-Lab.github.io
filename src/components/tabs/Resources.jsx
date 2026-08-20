import { useMemo } from "react";
import "./Resources.css";
import { getResearchResources } from "../../utils/researchData";

function Resources() {
    const labResources = useMemo(() => getResearchResources(), []);

    return (
        <div data-reveal data-reveal-load-delay="60" className="resources">
            <div
                data-reveal
                className="tab-header page-head page-head--resources">
                <h1>Resources</h1>
                <p className="page-head__summary">
                    Core infrastructure that supports training,
                    experimentation, and deployment across the lab.
                </p>
            </div>

            {labResources.length ? (
                <section
                    data-reveal
                    className="resources__grid-section page-panel page-panel--section-start"
                    aria-labelledby="resources-title">
                    <div className="resources__section-head">
                        <div>
                            <h2 id="resources-title">
                                Lab Resources & Infrastructure
                            </h2>
                            <p>
                                Core infrastructure that supports training,
                                experimentation, and deployment.
                            </p>
                        </div>
                    </div>
                    <div className="resources__grid">
                        {labResources.map((resource, index) => (
                            <article
                                key={resource.id}
                                data-reveal
                                data-reveal-load-delay={`${120 + Math.min(index, 4) * 60}`}
                                style={{
                                    "--reveal-delay": `${Math.min(index, 4) * 60}ms`,
                                }}
                                className="resources__card interactive-card">
                                <div className="resources__card-media">
                                    {resource.image ? (
                                        <img
                                            src={resource.image}
                                            alt={resource.imageAlt}
                                            loading="lazy"
                                            decoding="async"
                                            sizes="(max-width: 768px) 92vw, 18rem"
                                        />
                                    ) : (
                                        <div className="resources__card-media-placeholder">
                                            Image placeholder
                                        </div>
                                    )}
                                </div>
                                <div className="resources__card-copy">
                                    <p className="resources__card-label">
                                        {resource.label}
                                    </p>
                                    <p className="resources__card-value">
                                        {resource.value}
                                    </p>
                                    <p className="resources__card-description">
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

export default Resources;
