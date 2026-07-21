import PublicationLinkIcons, {
    getPublicationPrimaryLink,
} from "./Publication.LinkIcons";
import PublicationFigure from "./Publication.Figure";
import { RESEARCH_CATEGORY_LABELS } from "../../utils/researchData";

const CATEGORY_META = {
    application: { label: RESEARCH_CATEGORY_LABELS.application },
    biomedical: { label: RESEARCH_CATEGORY_LABELS.biomedical },
    core: { label: RESEARCH_CATEGORY_LABELS.core },
    "multi-modal": { label: RESEARCH_CATEGORY_LABELS["multi-modal"] },
};

const isValidHttpUrl = (url) => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
};

function PublicationCard({
    publicationId,
    category,
    meta,
    title,
    revealDelay = "0ms",
    revealLoadDelay = "80",
}) {
    const paperLink = getPublicationPrimaryLink(meta);
    const hasPaperLink = isValidHttpUrl(paperLink);
    const categoryMeta =
        CATEGORY_META[category] ?? CATEGORY_META["multi-modal"];
    const authorText = meta.author?.trim() ?? "";
    const venueText = meta.published_place?.trim() ?? "";
    const dateText = meta.published_date?.trim() ?? "";
    const keywordList = Array.isArray(meta.keywords) ? meta.keywords : [];

    return (
        <article
            data-reveal
            data-reveal-load-delay={revealLoadDelay}
            style={{ "--reveal-delay": revealDelay }}
            className="publication__card">
            <PublicationFigure
                publicationId={publicationId}
                className="publication__card-media"
                sizes="(max-width: 768px) 13rem, 11.2rem"
            />
            <div className="publication__card-main">
                <div className="publication__card-badges">
                    <p
                        className={`publication__card-badge publication__card-badge--${category}`}>
                        {categoryMeta.label}
                    </p>
                </div>
                {keywordList.length ? (
                    <div
                        className="publication__card-keywords"
                        aria-label={`${title} keywords`}>
                        {keywordList.map((keywordItem, keywordIndex) => (
                            <span
                                key={`${title}-${keywordItem}-${keywordIndex}`}
                                className="publication__card-keyword-chip">
                                {keywordItem}
                            </span>
                        ))}
                    </div>
                ) : null}
                <h3 className="publication__card-title">
                    {hasPaperLink ? (
                        <a
                            href={paperLink}
                            target="_blank"
                            rel="noreferrer"
                            className="publication__card-title-link animated-underline">
                            {title}
                        </a>
                    ) : (
                        <span className="publication__card-title-link publication__card-title-link--muted">
                            {title}
                        </span>
                    )}
                </h3>

                {authorText ? (
                    <p className="publication__card-author">{authorText}</p>
                ) : null}
                {(venueText || dateText) && (
                    <p className="publication__card-meta-line">
                        {venueText ? (
                            <span className="publication__card-venue">
                                {venueText}
                            </span>
                        ) : null}
                        {dateText ? (
                            <span className="publication__card-date">
                                {dateText}
                            </span>
                        ) : null}
                    </p>
                )}
            </div>
            <div className="publication__card-links">
                <PublicationLinkIcons meta={meta} />
            </div>
        </article>
    );
}

export default PublicationCard;
