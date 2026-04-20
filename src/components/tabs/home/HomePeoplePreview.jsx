import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { getLatestPhotoItems, getPeopleSpotlight } from "./homeData";
import {
    PERSONAL_LINK_ITEMS,
    getPersonalLinkUrl,
    isValidExternalLink,
} from "../peopleCardShared";

const withBasePath = (relativePath) => {
    const basePath = import.meta.env.BASE_URL || "/";
    return `${basePath.replace(/\/+$/, "/")}${String(
        relativePath || "",
    ).replace(/^\/+/, "")}`;
};

export default function HomePeoplePreview() {
    const members = getPeopleSpotlight();
    const latestPhotos = getLatestPhotoItems(6);

    return (
        <section
            data-reveal
            data-reveal-load-delay="220"
            className="home-block home-people-preview"
            aria-labelledby="home-people-title">
            <div className="home-block__head">
                <div>
                    <h2 id="home-people-title">People</h2>
                    <p>
                        Meet the professor and members behind current CVL-Lab
                        research.
                    </p>
                </div>
            </div>

            <section
                data-reveal
                data-reveal-load-delay="140"
                className="home-people__culture"
                aria-label="Recent lab culture photos">
                <div
                    className="home-people__culture-track"
                    aria-label="Recent lab photos">
                    {latestPhotos.map((photoItem) => (
                        <figure
                            key={photoItem.id}
                            className="home-people__culture-photo">
                            <img
                                src={withBasePath(
                                    photoItem.thumbnail || photoItem.full,
                                )}
                                alt={photoItem.alt || photoItem.title}
                                loading="lazy"
                                decoding="async"
                            />
                            <figcaption>{photoItem.title}</figcaption>
                        </figure>
                    ))}

                    <div className="home-people__culture-more-wrap">
                        <Link
                            to="/photo"
                            className="home-people__culture-more btn btn--secondary btn--sm interactive-button">
                            More
                        </Link>
                    </div>
                </div>
            </section>

            <div className="home-people__grid">
                {members.map((member, index) => (
                    <article
                        key={member.id}
                        data-reveal
                        data-reveal-load-delay={`${120 + index * 60}`}
                        style={{ "--reveal-delay": `${index * 60}ms` }}
                        className="home-people__member-card interactive-card">
                        <div className="home-people__member-main">
                            <div className="home-people__member-identity">
                                <div className="home-people__member-photo">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                        />
                                    ) : (
                                        <span>{member.name?.[0]}</span>
                                    )}
                                </div>
                            </div>

                            <div className="home-people__member-content">
                                <h3 className="home-people__meta-line home-people__meta-line--name">
                                    <span
                                        className="home-people__meta-icon"
                                        aria-hidden="true">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <span>{member.name}</span>
                                </h3>

                                <div className="home-people__member-header-divider" />

                                <div className="home-people__member-meta">
                                    <p className="home-people__meta-line home-people__member-position">
                                        <span>{member.position}</span>
                                    </p>
                                    {member.email ? (
                                        <a
                                            className="home-people__meta-line home-people__member-email"
                                            href={`mailto:${member.email}`}>
                                            <span
                                                className="home-people__meta-icon"
                                                aria-hidden="true">
                                                <FontAwesomeIcon
                                                    icon={faEnvelope}
                                                />
                                            </span>
                                            <span>{member.email}</span>
                                        </a>
                                    ) : (
                                        <p className="home-people__meta-line home-people__member-email home-people__member-email--placeholder">
                                            <span
                                                className="home-people__meta-icon"
                                                aria-hidden="true">
                                                <FontAwesomeIcon
                                                    icon={faEnvelope}
                                                />
                                            </span>
                                            <span>Email not listed</span>
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="home-people__action-group"
                                    aria-label={`${member.name} external profile links`}>
                                    <div className="home-people__social-links">
                                        {PERSONAL_LINK_ITEMS.map((item) => {
                                            const url = getPersonalLinkUrl(
                                                item.key,
                                                member.homepage,
                                                member.links,
                                            );
                                            const isEnabled =
                                                isValidExternalLink(url);

                                            if (!isEnabled) {
                                                return (
                                                    <span
                                                        key={item.key}
                                                        className="home-people__social-link home-people__social-link--disabled btn btn--icon btn--sm is-disabled"
                                                        aria-hidden="true">
                                                        <FontAwesomeIcon
                                                            icon={item.icon}
                                                        />
                                                    </span>
                                                );
                                            }

                                            return (
                                                <a
                                                    key={item.key}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="home-people__social-link btn btn--icon btn--sm interactive-button"
                                                    aria-label={`${member.name} ${item.label}`}>
                                                    <FontAwesomeIcon
                                                        icon={item.icon}
                                                    />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="home-block__section-footer">
                <Link
                    to="/people"
                    state={{ scroll: { mode: "top" } }}
                    className="home-block__section-action btn btn--tertiary animated-underline">
                    View all people
                    <span className="home-block__section-action-icon">→</span>
                </Link>
            </div>
        </section>
    );
}
