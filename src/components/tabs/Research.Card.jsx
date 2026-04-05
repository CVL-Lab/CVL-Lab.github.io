import { Link } from "react-router-dom";
import { getResearchAreaPalette } from "../../utils/researchAreaColors";
import "./Research.Card.css";

function ResearchCard({
  title,
  subtitle = [],
  explaination,
  tags = [],
  topicKey,
  publicationCategory,
  hasPublicationCategory = true,
  publicationCount = 0,
  image = null,
  isSelected,
  revealDelay = "0ms",
  revealLoadDelay = "80",
}) {
  const palette = getResearchAreaPalette(publicationCategory || topicKey);
  const subtitleNormalized = new Set(
    subtitle.map((item) => item.toLowerCase().replace(/\s+/g, " ").trim()),
  );
  const dedupedTags = tags.filter(
    (item) => !subtitleNormalized.has(item.toLowerCase().replace(/\s+/g, " ").trim()),
  );
  const subtitleText = subtitle.join(" · ");
  const publicationActionText = publicationCount
    ? `Explore related publications (${publicationCount})`
    : "Explore publications";
  const publicationLink = hasPublicationCategory
    ? `/publication?area=${encodeURIComponent(
        publicationCategory,
      )}&scope=title-authors`
    : `/publication?q=${encodeURIComponent(title)}&scope=title-authors`;

  return (
    <article
      id={`research-topic-${topicKey}`}
      data-research-topic={topicKey}
      data-reveal
      data-reveal-load-delay={revealLoadDelay}
      style={{
        "--reveal-delay": revealDelay,
        "--topic-tint": palette.tint,
        "--topic-border": palette.border,
        "--topic-accent": palette.accent,
      }}
      className={`research-card research-card--${topicKey} interactive-card ${isSelected ? "is-selected" : ""}`}
    >
      <div className="research-card-media">
        <Link
          to={publicationLink}
          className="research-card-media-link"
          aria-label={`${publicationActionText} for ${title}`}
        >
          {image ? (
            <img src={image} alt={`${title} representative visual`} />
          ) : (
            <div className="research-card-media-placeholder">Image placeholder</div>
          )}
          <div className="research-card-media-overlay" aria-hidden="true">
            <span className="research-card-media-cta">Explore publications</span>
          </div>
        </Link>
      </div>

      <div className="research-card-content-wrapper">
        <div className="research-card-head">
          <h2 className="research-card-title">{title}</h2>
        </div>

        <p className="research-card-description">{explaination}</p>

        {subtitleText ? (
          <div className="research-card-positioning">
            <p className="research-card-positioning-label">Positioning</p>
            <p className="research-card-subtitle">{subtitleText}</p>
          </div>
        ) : null}

        {dedupedTags.length > 0 ? (
          <div className="research-card-metadata">
            <p className="research-card-metadata-label">Keywords</p>
            <div className="research-card-tags">
              {dedupedTags.map((tagItem, i) => (
                <span key={i} className="research-card-tag">
                  {tagItem}
                </span>
              ))}
            </div>
          </div>
        ) : null}

      </div>
    </article>
  );
}

export default ResearchCard;
