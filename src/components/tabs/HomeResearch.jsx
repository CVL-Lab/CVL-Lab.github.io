import "./HomeResearch.css";
import HomeResearchCard from "./HomeResearch.Card";
import { Link } from "react-router-dom";
import { getResearchAreas } from "../../utils/researchData";

function HomeResearch({ handleActiveResearch }) {
    const researchContents = getResearchAreas().map((item) => ({
        ...item,
        keywords: item.tags,
        path: item.path,
    }));

    return (
        <div className="home-research">
            <div data-reveal className="home-block__head home-research__header">
                <div>
                    <h2>Research Areas</h2>
                    <p>
                        Explore the core research areas that shape our lab's
                        work.
                    </p>
                </div>
            </div>
            <div className="home-research__grid">
                {researchContents.map((contentItem, index) => (
                    <HomeResearchCard
                        handleActiveResearch={handleActiveResearch}
                        key={contentItem.title}
                        revealDelay={`${index * 70}ms`}
                        revealLoadDelay={`${120 + index * 70}`}
                        {...contentItem}
                    />
                ))}
            </div>
            <div className="home-block__section-footer">
                <Link
                    to="/research"
                    state={{ scroll: { mode: "top" } }}
                    className="home-block__section-action btn btn--tertiary animated-underline">
                    View all research
                    <span className="home-block__section-action-icon">→</span>
                </Link>
            </div>
        </div>
    );
}

export default HomeResearch;
