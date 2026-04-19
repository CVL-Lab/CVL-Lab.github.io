function HomeResearchCard({
    handleActiveResearch,
    title,
    topicKey,
    path,
    keywords = [],
    image,
    revealDelay,
    revealLoadDelay,
}) {
    const topic = topicKey;

    const setTopic = () => {
        handleActiveResearch({ topicKey: topic, path });
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setTopic();
        }
    };

    const mediaStyle = {
        backgroundImage: `url(${image})`,
    };

    return (
        <article
            data-reveal
            data-reveal-load-delay={revealLoadDelay}
            style={{ "--reveal-delay": revealDelay }}
            className={`home-research__card home-research__card--${topic} interactive-card is-clickable`}
            role="button"
            tabIndex={0}
            onClick={setTopic}
            onKeyDown={handleKeyDown}
            aria-label={`Open ${title} research area details`}>
            <div className="home-research__card-media" style={mediaStyle}>
                <div
                    className="home-research__card-media-overlay"
                    aria-hidden="true">
                    <span className="home-research__card-media-cta">
                        Explore research area
                    </span>
                </div>
            </div>
            <div className="home-research__card-content">
                <div className="home-research__card-title-wrap">
                    <h3 className="home-research__card-title">{title}</h3>
                </div>
                <div
                    className="home-research__card-subtitle"
                    aria-label={`${title} topic tags`}>
                    {keywords.map((keywordItem, i) => (
                        <p key={i}>{keywordItem}</p>
                    ))}
                </div>
                <div className="home-research__card-footer">
                    <p className="home-research__card-cta animated-underline">
                        Explore research area →
                    </p>
                </div>
            </div>
        </article>
    );
}

export default HomeResearchCard;
