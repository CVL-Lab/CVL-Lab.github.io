import { Link } from "react-router-dom";
import { getLatestPublications, isValidHttpUrl } from "./homeData";
import PublicationLinkIcons, {
    getPublicationPrimaryLink,
} from "../Publication.LinkIcons";
import PublicationFigure from "../Publication.Figure";
import { RESEARCH_CATEGORY_LABELS } from "../../../utils/researchData";

const formatPublicationVenue = (item) => {
    const venue = item.research_meta.published_place?.trim();
    const date = item.research_meta.published_date?.trim();
    return [venue, date].filter(Boolean).join(" · ");
};

export default function HomeSelectedPublications() {
    const publications = getLatestPublications(4);
    const [featuredPublication, ...previewPublications] = publications;

    if (!featuredPublication) {
        return null;
    }

    const featuredPaperLink = getPublicationPrimaryLink(
        featuredPublication.research_meta,
    );
    const hasFeaturedExternalLink = isValidHttpUrl(featuredPaperLink);
    const featuredQueryTarget = `/publication?q=${encodeURIComponent(featuredPublication.title)}&scope=title-authors-venue`;
    const featuredCategoryLabel =
        RESEARCH_CATEGORY_LABELS[featuredPublication.category] ??
        featuredPublication.category;
    return (
        <section
            data-reveal
            data-reveal-load-delay="140"
            className="home-block home-selected-publications"
            aria-labelledby="home-selected-publications-title">
            <div className="home-block__head">
                <div>
                    <h2 id="home-selected-publications-title">Publications</h2>
                    <p>
                        Browse our latest publications and research highlights.
                    </p>
                </div>
            </div>

            <article
                data-reveal
                data-reveal-load-delay="160"
                className="home-pubs__featured interactive-card">
                <PublicationFigure
                    publicationId={featuredPublication.id}
                    className="home-pubs__featured-media"
                    sizes="(max-width: 768px) 13rem, 11.2rem"
                />
                <div className="home-pubs__featured-main">
                    <p className="home-pubs__featured-kicker">
                        Featured publication
                    </p>
                    <div className="home-pubs__featured-top">
                        <p
                            className={`home-pubs__badge home-pubs__badge--${featuredPublication.category}`}>
                            {featuredCategoryLabel}
                        </p>
                    </div>
                    {featuredPublication.research_meta.keywords?.length ? (
                        <div
                            className="home-pubs__keywords"
                            aria-label="Featured publication keywords">
                            {featuredPublication.research_meta.keywords.map(
                                (keywordItem, keywordIndex) => (
                                    <span
                                        key={`${keywordItem}-${keywordIndex}`}
                                        className="home-pubs__keyword-chip">
                                        {keywordItem}
                                    </span>
                                ),
                            )}
                        </div>
                    ) : null}
                    <h3 className="home-pubs__featured-title">
                        {hasFeaturedExternalLink ? (
                            <a
                                href={featuredPaperLink}
                                target="_blank"
                                rel="noreferrer">
                                <span className="animated-underline">
                                    {featuredPublication.title}
                                </span>
                            </a>
                        ) : (
                            <Link to={featuredQueryTarget}>
                                <span className="animated-underline">
                                    {featuredPublication.title}
                                </span>
                            </Link>
                        )}
                    </h3>
                    <p className="home-pubs__featured-authors">
                        {featuredPublication.research_meta.author}
                    </p>
                    <p className="home-pubs__featured-venue">
                        {formatPublicationVenue(featuredPublication)}
                    </p>
                </div>
                <div className="home-pubs__featured-links">
                    <PublicationLinkIcons
                        meta={featuredPublication.research_meta}
                    />
                </div>
            </article>

            <div className="home-pubs__list">
                {previewPublications.map((item, index) => {
                    const revealDelay = `${index * 60}ms`;
                    const revealLoadDelay = `${200 + index * 60}`;
                    const queryTarget = `/publication?q=${encodeURIComponent(item.title)}&scope=title-authors-venue`;
                    const categoryLabel =
                        RESEARCH_CATEGORY_LABELS[item.category] ||
                        item.category;
                    return (
                        <article
                            key={item.key}
                            data-reveal
                            data-reveal-load-delay={revealLoadDelay}
                            style={{ "--reveal-delay": revealDelay }}
                            className="home-pubs__row interactive-row">
                            <PublicationFigure
                                publicationId={item.id}
                                className="home-pubs__row-media"
                                sizes="(max-width: 768px) 13rem, 11.2rem"
                            />
                            <div className="home-pubs__meta">
                                <p
                                    className={`home-pubs__badge home-pubs__badge--${item.category}`}>
                                    {categoryLabel}
                                </p>
                                {item.research_meta.keywords?.length ? (
                                    <div
                                        className="home-pubs__keywords"
                                        aria-label={`${item.title} keywords`}>
                                        {item.research_meta.keywords.map(
                                            (keywordItem, keywordIndex) => (
                                                <span
                                                    key={`${item.key}-keyword-${keywordItem}-${keywordIndex}`}
                                                    className="home-pubs__keyword-chip">
                                                    {keywordItem}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                ) : null}
                                <p className="home-pubs__title interactive-row__title">
                                    <Link
                                        to={queryTarget}
                                        className="home-pubs__title-link animated-underline">
                                        {item.title}
                                    </Link>
                                </p>
                                <p>{formatPublicationVenue(item)}</p>
                            </div>
                            <div className="home-pubs__row-links">
                                <PublicationLinkIcons
                                    meta={item.research_meta}
                                />
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="home-block__section-footer">
                <Link
                    to="/publication"
                    state={{ scroll: { mode: "top" } }}
                    className="home-block__section-action btn btn--tertiary animated-underline">
                    View all publications
                    <span className="home-block__section-action-icon">→</span>
                </Link>
            </div>
        </section>
    );
}
