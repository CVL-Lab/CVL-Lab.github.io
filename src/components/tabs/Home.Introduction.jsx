import "./Home.Introduction.css";
import { Link } from "react-router-dom";
import { getHomeMediaBySection } from "./home/homeData";
import { getPeopleEntriesBySection } from "../../utils/peopleData";

const RESEARCH_FOCUS = [
    "Computer Vision",
    "Robot Learning",
    "Efficient LLMs",
    "Medical AI",
    "Industrial AI",
];

const RESOURCE_COUNTS = {
    gpus: 8,
    robots: 1,
};

const buildIntroductionMediaMap = () => {
    const professorCount = getPeopleEntriesBySection("professor").length;
    const integratedPhdCount =
        getPeopleEntriesBySection("integrated_mp").length;
    const phdCount = getPeopleEntriesBySection("phd").length;
    const masterCount = getPeopleEntriesBySection("master").length;
    const internCount = getPeopleEntriesBySection("intern").length;
    const totalPhdCount = integratedPhdCount + phdCount;

    return {
        intro_group_photo: {
            title: "People",
            description: `${professorCount} Professor, ${totalPhdCount} PhD, ${masterCount} MS, ${internCount} Interns`,
            to: "/people",
        },
        intro_meeting_room: {
            title: "Lab Resources",
            description: `${RESOURCE_COUNTS.gpus} GPUs, ${RESOURCE_COUNTS.robots} Robots`,
            to: "/research",
            state: {
                scroll: {
                    mode: "selector",
                    selector: "#research-resources-title",
                    block: "start",
                },
            },
        },
    };
};

function HomeIntroduction() {
    const mediaMap = buildIntroductionMediaMap();
    const mediaItems = getHomeMediaBySection("introduction", 2).map((item) => {
        const itemOverride = mediaMap[item.id] ?? null;

        return itemOverride
            ? {
                  ...item,
                  ...itemOverride,
              }
            : item;
    });
    const featuredMedia = mediaItems[0];
    const supportingMedia = mediaItems[1];

    return (
        <div className="home-introduction">
            <div
                data-reveal
                data-reveal-load-delay="170"
                className="home-introduction__copy">
                <div className="home-block__head home-introduction__head">
                    <div>
                        <h2>Overview</h2>
                        <p>
                            Computer vision and learning research for real-world
                            impact.
                        </p>
                    </div>
                </div>
                <p className="home-introduction__summary">
                    Our research spans a broad range of machine learning
                    problems, with particular emphasis on computer vision and
                    robot learning. We are also interested in efficient deep
                    learning, especially methods for compressing large language
                    models. Our ultimate goal is to develop multimodal learning
                    frameworks that integrate efficient large-scale vision
                    models and LLMs for robotics, medical data and industrial
                    applications. To this end, publishing our work at top-tier
                    conferences is a key priority for our lab. We welcome
                    inquiries from anyone interested in our research.
                </p>
                <div
                    className="home-introduction__keyword"
                    aria-label="Lab research keywords">
                    {RESEARCH_FOCUS.map((item) => (
                        <span
                            key={item}
                            className="home-introduction__keyword-chip">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <div
                data-reveal
                data-reveal-load-delay="210"
                className="home-introduction__media">
                <figure
                    data-reveal
                    data-reveal-load-delay="240"
                    className="home-introduction__figure home-introduction__figure--featured">
                    {featuredMedia?.to ? (
                        <Link
                            to={featuredMedia.to}
                            state={featuredMedia.state}
                            className="home-introduction__figure-link">
                            {featuredMedia.image ? (
                                <img
                                    src={featuredMedia.image}
                                    alt={
                                        featuredMedia.alt || featuredMedia.title
                                    }
                                />
                            ) : (
                                <div className="home-introduction__placeholder">
                                    Image placeholder
                                </div>
                            )}
                            <figcaption>
                                <strong>{featuredMedia.title}</strong>
                                <span>{featuredMedia.description}</span>
                            </figcaption>
                        </Link>
                    ) : featuredMedia ? (
                        <>
                            {featuredMedia.image ? (
                                <img
                                    src={featuredMedia.image}
                                    alt={
                                        featuredMedia.alt || featuredMedia.title
                                    }
                                />
                            ) : (
                                <div className="home-introduction__placeholder">
                                    Image placeholder
                                </div>
                            )}
                            <figcaption>
                                <strong>{featuredMedia.title}</strong>
                                <span>{featuredMedia.description}</span>
                            </figcaption>
                        </>
                    ) : null}
                </figure>
                {supportingMedia ? (
                    <figure
                        data-reveal
                        data-reveal-load-delay="280"
                        className="home-introduction__figure home-introduction__figure--support">
                        {supportingMedia.to ? (
                            <Link
                                to={supportingMedia.to}
                                state={supportingMedia.state}
                                className="home-introduction__figure-link">
                                {supportingMedia.image ? (
                                    <img
                                        src={supportingMedia.image}
                                        alt={
                                            supportingMedia.alt ||
                                            supportingMedia.title
                                        }
                                    />
                                ) : (
                                    <div className="home-introduction__placeholder">
                                        Image placeholder
                                    </div>
                                )}
                                <figcaption>
                                    <strong>{supportingMedia.title}</strong>
                                    <span>
                                        {supportingMedia.description ||
                                            "Editorial media slot prepared for future homepage updates."}
                                    </span>
                                </figcaption>
                            </Link>
                        ) : (
                            <>
                                {supportingMedia.image ? (
                                    <img
                                        src={supportingMedia.image}
                                        alt={
                                            supportingMedia.alt ||
                                            supportingMedia.title
                                        }
                                    />
                                ) : (
                                    <div className="home-introduction__placeholder">
                                        Image placeholder
                                    </div>
                                )}
                                <figcaption>
                                    <strong>{supportingMedia.title}</strong>
                                    <span>
                                        {supportingMedia.description ||
                                            "Editorial media slot prepared for future homepage updates."}
                                    </span>
                                </figcaption>
                            </>
                        )}
                    </figure>
                ) : null}
            </div>
        </div>
    );
}

export default HomeIntroduction;
