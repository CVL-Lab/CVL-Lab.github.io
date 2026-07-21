import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faEnvelope,
    faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getPersonalLinkItemsWithState } from "./peopleCardShared";

function PeopleCard({
    profile,
    name,
    email,
    position = "",
    homepage = "",
    links = {},
    research_interest = null,
    current_position = null,
    revealDelay = "0ms",
    revealLoadDelay = "80",
}) {
    const nameText = name?.trim() ?? "";
    const emailText = email?.trim() ?? "";
    const positionText = position?.trim() ?? "";
    const homepageText = homepage?.trim() ?? "";
    const publicationSearchLink = nameText
        ? `/publication?q=${encodeURIComponent(nameText)}&scope=title-authors`
        : "/publication";
    const personalLinks = getPersonalLinkItemsWithState(homepageText, links);

    const hasResearchInterests =
        Array.isArray(research_interest) && research_interest.length > 0;
    const hasCurrentPosition =
        Array.isArray(current_position) && current_position.length > 0;
    const infoLabel = hasCurrentPosition
        ? "Current position"
        : "Research interests";
    const infoItems = hasCurrentPosition
        ? current_position
        : hasResearchInterests
          ? research_interest
          : ["Not listed"];

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
                                loading="lazy"
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
                        {positionText ? (
                            <p className="people__member-position">
                                {positionText}
                            </p>
                        ) : null}
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

                        <div className="people__action-row people__action-row--publication">
                            <Link
                                to={publicationSearchLink}
                                className="people__meta-action people__meta-action--publication btn btn--secondary btn--sm interactive-button"
                                aria-label={`Search publications by ${nameText}`}>
                                <span
                                    className="people__meta-action-icon"
                                    aria-hidden="true">
                                    <FontAwesomeIcon icon={faBookOpen} />
                                </span>
                                <span>View publications</span>
                            </Link>
                        </div>
                    </div>

                    <div className="people__member-info">
                        <h4 className="people__card-subheading">
                            <span
                                className="people__card-subheading-icon"
                                aria-hidden="true">
                                <FontAwesomeIcon icon={faLightbulb} />
                            </span>
                            <span>{infoLabel}</span>
                        </h4>
                        <div className="people__interest-list">
                            {infoItems.map((item, i) => (
                                <span key={i} className="people__interest-chip">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default PeopleCard;
