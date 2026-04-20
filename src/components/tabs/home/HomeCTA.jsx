import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faEnvelope,
    faUser,
    faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";

const PRIMARY_CONTACTS = [
    {
        id: "professor",
        role: "Professor",
        email: "jongbinryu@ajou.ac.kr",
        icon: faUser,
    },
    {
        id: "student-representative",
        role: "Student Representative",
        email: "kimsungeun@ajou.ac.kr",
        icon: faUserGraduate,
    },
];

export default function HomeCTA() {
    return (
        <section
            data-reveal
            data-reveal-load-delay="260"
            className="home-block home-cta"
            aria-labelledby="home-cta-title">
            <div className="home-cta__content">
                <div className="home-block__head home-cta__head">
                    <div>
                        <h2 id="home-cta-title">Contact</h2>
                    </div>
                </div>
                <p className="home-cta__institution">
                    We welcome inquiries from students, collaborators, and
                    anyone interested in our lab. Please feel free to contact us
                    using the contact information below. We work with many
                    academic and industrial partners on practical learning
                    algorithms and industrial AI applications
                </p>
            </div>
            <div className="home-cta__actions">
                <div
                    className="home-cta__contacts"
                    aria-label="Primary contacts">
                    {PRIMARY_CONTACTS.map((contactItem) => (
                        <article
                            key={contactItem.id}
                            className="home-cta__contact-card">
                            <p className="home-cta__contact-role">
                                <span
                                    className="home-cta__contact-icon"
                                    aria-hidden="true">
                                    <FontAwesomeIcon icon={contactItem.icon} />
                                </span>
                                <span>{contactItem.role}</span>
                            </p>
                            <a
                                className="home-cta__contact-email"
                                href={`mailto:${contactItem.email}`}>
                                <span
                                    className="home-cta__contact-icon"
                                    aria-hidden="true">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <span>{contactItem.email}</span>
                            </a>
                        </article>
                    ))}
                </div>
                <Link
                    to="/contact"
                    className="home-cta__btn home-cta__btn--primary btn btn--secondary interactive-button lift-on-hover">
                    <span>More Information</span>
                    <span className="home-cta__btn-icon" aria-hidden="true">
                        <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                </Link>
            </div>
        </section>
    );
}
