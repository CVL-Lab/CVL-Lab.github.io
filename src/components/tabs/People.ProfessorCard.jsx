import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { getPersonalLinkItemsWithState } from "./peopleCardShared";

const trimText = (value) => (typeof value === "string" ? value.trim() : "");
const PLACEHOLDER_TEXT_PATTERN =
    /lorem ipsum|will be added|will summarize|will be listed|will be updated/i;

const getDisplayText = (value) => {
    const text = trimText(value);
    return PLACEHOLDER_TEXT_PATTERN.test(text) ? "" : text;
};

const RESEARCH_DIRECTION_FALLBACK =
    "Leads MMAI Lab research in computer vision and learning, connecting core AI methods with applied research projects.";

function PeopleProfessorCard({
    profile,
    name,
    email,
    homepage = "",
    position = "",
    links = {},
    profileDetails = null,
    revealDelay = "0ms",
    revealLoadDelay = "80",
}) {
    const nameText = name?.trim() ?? "";
    const emailText = email?.trim() ?? "";
    const positionText = position?.trim() ?? "Professor";
    const homepageText = homepage?.trim() ?? "";
    const researchDirectionText =
        getDisplayText(profileDetails?.research_overview) ||
        RESEARCH_DIRECTION_FALLBACK;
    const personalLinks = getPersonalLinkItemsWithState(homepageText, links);

    return (
        <article
            data-reveal
            data-reveal-load-delay={revealLoadDelay}
            style={{ "--reveal-delay": revealDelay }}
            className="people__member-card interactive-card">
            <div className="people__member-main">
                <div className="people__member-identity">
                    <div className="people__member-photo">
                        {profile ? (
                            <img
                                src={profile}
                                alt={nameText}
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                                sizes="(max-width: 430px) 12rem, 10rem"
                            />
                        ) : (
                            <span>{nameText?.[0]}</span>
                        )}
                    </div>
                </div>

                <div className="people__member-content">
                    <div className="people__member-header">
                        <h3 className="people__meta-line people__meta-line--name">
                            {nameText}
                        </h3>
                        <p className="people__member-position">
                            {positionText}
                        </p>
                    </div>

                    {emailText ? (
                        <div className="people__member-meta">
                            <a
                                className="people__meta-line people__member-email"
                                href={`mailto:${emailText}`}>
                                <span
                                    className="people__meta-icon"
                                    aria-hidden="true">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <span>{emailText}</span>
                            </a>
                        </div>
                    ) : null}

                    <div
                        className="people__action-group people__member-action-group"
                        aria-label={`${nameText} profile actions`}>
                        <div className="people__action-row people__action-row--icons">
                            <div
                                className="people__social-links people__social-links--inline people__action-icons"
                                aria-label={`${nameText} external profile links`}>
                                {personalLinks.map((item) =>
                                    item.isEnabled ? (
                                        <a
                                            key={item.key}
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`people__social-link people__social-link--${item.key} btn btn--icon btn--sm interactive-button`}
                                            aria-label={`${nameText} ${item.label}`}>
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                            />
                                        </a>
                                    ) : (
                                        <span
                                            key={item.key}
                                            className={`people__social-link people__social-link--${item.key} people__social-link--disabled btn btn--icon btn--sm is-disabled`}
                                            title={`${item.label} not listed`}
                                            aria-hidden="true">
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                            />
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="people__member-info">
                        <h4 className="people__card-subheading">
                            <span
                                className="people__card-subheading-icon"
                                aria-hidden="true">
                                <FontAwesomeIcon icon={faLightbulb} />
                            </span>
                            <span>Research direction</span>
                        </h4>
                        <p className="people__member-info-text">
                            {researchDirectionText}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default PeopleProfessorCard;
