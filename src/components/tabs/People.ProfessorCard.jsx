import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  PERSONAL_LINK_ITEMS,
  getPersonalLinkUrl,
  isValidExternalLink,
} from "./peopleCardShared";

const trimText = (value) => (typeof value === "string" ? value.trim() : "");

const PROFESSOR_DETAIL_FALLBACKS = {
  biography:
    "A concise biography will be added here to introduce the professor's academic background and current role.",
  research_overview:
    "This section will summarize the lab's core research agenda and the professor's ongoing research direction.",
  education:
    "Education and academic background details will be listed here, including prior institutions and training.",
  affiliations:
    "Professional roles, committee memberships, and external collaborations will be summarized in this section.",
  achievements:
    "Representative awards, leadership responsibilities, and notable achievements will be added here.",
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
  const details = [
    {
      key: "biography",
      title: "Short biography",
      content: trimText(profileDetails?.biography) || PROFESSOR_DETAIL_FALLBACKS.biography,
    },
    {
      key: "research_overview",
      title: "Research overview",
      content:
        trimText(profileDetails?.research_overview) || PROFESSOR_DETAIL_FALLBACKS.research_overview,
    },
    {
      key: "education",
      title: "Education & academic background",
      content:
        trimText(profileDetails?.education) ||
        trimText(profileDetails?.history) ||
        PROFESSOR_DETAIL_FALLBACKS.education,
    },
    {
      key: "affiliations",
      title: "Professional roles & affiliations",
      content:
        trimText(profileDetails?.affiliations) ||
        trimText(profileDetails?.responsibilities) ||
        PROFESSOR_DETAIL_FALLBACKS.affiliations,
    },
    {
      key: "achievements",
      title: "Notable achievements",
      content: trimText(profileDetails?.achievements) || PROFESSOR_DETAIL_FALLBACKS.achievements,
    },
  ];
  const profileSummary = `${positionText} · Vision and Multimodal AI Lab`;

  return (
    <article
      data-reveal
      data-reveal-load-delay={revealLoadDelay}
      style={{ "--reveal-delay": revealDelay }}
      className="people-professor-card interactive-card"
    >
      <section className="people-professor-card__identity-column" aria-label="Professor identity">
        <div className="people-professor-card__photo">
          {profile ? <img src={profile} alt={nameText} /> : <span>{nameText?.[0]}</span>}
        </div>

        <div className="people-professor-card__identity-main">
          <h3 className="people__meta-line people__meta-line--name">
            <span className="people__meta-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <span>{nameText}</span>
          </h3>
          <div className="people__member-header-divider people-professor-card__identity-divider" />
          <div className="people-professor-card__meta">
            <p className="people__meta-line people-professor-card__position">{positionText}</p>
            {emailText ? (
              <a className="people__meta-line people-professor-card__email" href={`mailto:${emailText}`}>
                <span className="people__meta-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <span>{emailText}</span>
              </a>
            ) : (
              <p
                className="people__meta-line people-professor-card__email people-professor-card__email--placeholder"
                aria-hidden="true"
              >
                <span className="people__meta-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <span>Email not listed</span>
              </p>
            )}
          </div>
          <div className="people__action-group people__member-action-group people__action-group--professor people-professor-card__action-group">
            <div className="people__action-row people__action-row--icons">
              <div
                className="people__social-links people__social-links--inline people__action-icons"
                aria-label={`${nameText} external profile links`}
              >
                {PERSONAL_LINK_ITEMS.map((item) => {
                  const url = getPersonalLinkUrl(item.key, homepageText, links);
                  const isEnabled = isValidExternalLink(url);

                  if (!isEnabled) {
                    return (
                      <span
                        key={item.key}
                        className="people__social-link people__social-link--disabled btn btn--icon btn--sm is-disabled"
                        aria-hidden="true"
                      >
                        <FontAwesomeIcon icon={item.icon} />
                      </span>
                    );
                  }

                  return (
                    <a
                      key={item.key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={`people__social-link people__social-link--${item.key} btn btn--icon btn--sm interactive-button`}
                      aria-label={`${nameText} ${item.label}`}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="people-professor-card__details" aria-label="Professor profile details">
        <div className="people-professor-card__details-head">
          <h4>Professor profile</h4>
          <p>{profileSummary}</p>
        </div>
        <div className="people-professor-card__details-grid">
          {details.map((item) => (
            <section
              key={item.key}
              className={`people-professor-card__detail-item people-professor-card__detail-item--${item.key}`}
            >
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
