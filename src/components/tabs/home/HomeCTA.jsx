import { Link } from "react-router-dom";

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
                    using the information on the right. We work with many
                    academic and industrial partners on practical learning
                    algorithms and industrial AI applications
                </p>
            </div>
            <div className="home-cta__actions">
                <div
                    className="home-cta__contacts"
                    aria-label="Primary contacts">
                    <p className="home-cta__contact-line">
                        <span>Professor:</span>{" "}
                        <a href="mailto:jongbinryu@ajou.ac.kr">
                            jongbinryu@ajou.ac.kr
                        </a>
                    </p>
                    <p className="home-cta__contact-line">
                        <span>Student Representative:</span>{" "}
                        <a href="mailto:kimsungeun@ajou.ac.kr">
                            kimsungeun@ajou.ac.kr
                        </a>
                    </p>
                </div>
                <Link
                    to="/contact"
                    className="home-cta__btn home-cta__btn--primary btn btn--primary interactive-button lift-on-hover">
                    More Information
                </Link>
            </div>
        </section>
    );
}
