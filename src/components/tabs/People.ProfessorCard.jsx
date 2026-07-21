import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { getPersonalLinkItemsWithState } from "./peopleCardShared";

const trimText = (value) => (typeof value === "string" ? value.trim() : "");
const PLACEHOLDER_TEXT_PATTERN =
    /lorem ipsum|will be added|will summarize|will be listed|will be updated/i;

const getDisplayText = (value) => {
    const text = trimText(value);
    return PLACEHOLDER_TEXT_PATTERN.test(text) ? "" : text;
};

const PROFESSOR_DETAIL_FALLBACKS = {
    research_overview:
        "Leads CVL-Lab research in computer vision and learning, connecting core AI methods with applied research projects.",
    mentoring:
        "Guides graduate researchers, interns, and alumni through publication-oriented lab work and project development.",
    lab_role:
        "Coordinates the lab's research direction, student supervision, and external research communication.",
};

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
    const verifiedDetails = [
        {
            key: "biography",
            title: "Short biography",
            content: getDisplayText(profileDetails?.biography),
        },
        {
            key: "research_overview",
            title: "Research overview",
            content: getDisplayText(profileDetails?.research_overview),
        },
        {
            key: "education",
            title: "Education & academic background",
            content:
                getDisplayText(profileDetails?.education) ||
                getDisplayText(profileDetails?.history),
        },
        {
            key: "affiliations",
            title: "Professional roles & affiliations",
            content:
                getDisplayText(profileDetails?.affiliations) ||
                getDisplayText(profileDetails?.responsibilities),
        },
        {
            key: "achievements",
            title: "Notable achievements",
            content: getDisplayText(profileDetails?.achievements),
        },
    ].filter((item) => item.content);
    const details =
        verifiedDetails.length > 0
            ? verifiedDetails
            : [
                  {
                      key: "research_overview",
                      title: "Research direction",
                      content: PROFESSOR_DETAIL_FALLBACKS.research_overview,
                  },
                  {
                      key: "mentoring",
                      title: "Mentoring",
                      content: PROFESSOR_DETAIL_FALLBACKS.mentoring,
                  },
                  {
                      key: "lab_role",
                      title: "Lab role",
                      content: PROFESSOR_DETAIL_FALLBACKS.lab_role,
                  },
              ];
    const profileSummary = `${positionText} · Computer Vision and Learning Lab`;
    const personalLinks = getPersonalLinkItemsWithState(homepageText, links);

    return (
        <article
            data-reveal
            data-reveal-load-delay={revealLoadDelay}
            style={{ "--reveal-delay": revealDelay }}
            className="people-professor-card interactive-card">
            <section
                className="people-professor-card__identity-column"
                aria-label="Professor identity">
                <div className="people-professor-card__photo">
                    {profile ? (
                        <img
                            src={profile}
                            alt={nameText}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            sizes="(max-width: 430px) 7rem, 10rem"
                        />
                    ) : (
                        <span>{nameText?.[0]}</span>
                    )}
                </div>

                <div className="people-professor-card__identity-main">
                    <header className="people-professor-card__identity-head">
                        <h3 className="people__meta-line people__meta-line--name">
                            {nameText}
                        </h3>
                        <p className="people__meta-line people-professor-card__position">
                            {positionText}
                        </p>
                    </header>
                    <div className="people-professor-card__meta">
                        {emailText ? (
                            <a
                                className="people__meta-line people-professor-card__email"
                                href={`mailto:${emailText}`}>
                                <span
                                    className="people__meta-icon"
                                    aria-hidden="true">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <span>{emailText}</span>
                            </a>
                        ) : null}
                    </div>
                    <div className="people__action-group people__member-action-group people__action-group--professor people-professor-card__action-group">
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
                                            <FontAwesomeIcon icon={item.icon} />
                                        </a>
                                    ) : (
                                        <span
                                            key={item.key}
                                            className={`people__social-link people__social-link--${item.key} people__social-link--disabled btn btn--icon btn--sm is-disabled`}
                                            title={`${item.label} not listed`}
                                            aria-hidden="true">
                                            <FontAwesomeIcon icon={item.icon} />
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <aside
                className="people-professor-card__details"
                aria-label="Professor profile details">
                <div className="people-professor-card__details-head">
                    <h4>Professor profile</h4>
                    <p>{profileSummary}</p>
                </div>
                <div className="people-professor-card__details-grid">
                    {details.map((item) => (
                        <section
                            key={item.key}
                            className={`people-professor-card__detail-item people-professor-card__detail-item--${item.key}`}>
                            <h5>{item.title}</h5>
                            <p>{item.content}</p>
                        </section>
                    ))}
                </div>
            </aside>
        </article>
    );
}

export default PeopleProfessorCard;
