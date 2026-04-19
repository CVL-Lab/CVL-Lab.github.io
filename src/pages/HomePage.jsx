import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/tabs/Home";
import { getResearchPath } from "../utils/researchData";

function HomePage() {
    const navigate = useNavigate();

    const handleActiveResearch = useCallback(
        (topicOrPayload) => {
            const fallbackPath = "/research";

            if (typeof topicOrPayload === "string") {
                navigate(getResearchPath(topicOrPayload), {
                    state: {
                        scroll: {
                            mode: "selector",
                            selector: "#research-area-details-title",
                            block: "start",
                        },
                    },
                });
                return;
            }

            const explicitPath =
                topicOrPayload && typeof topicOrPayload.path === "string"
                    ? topicOrPayload.path
                    : null;
            const resolvedPath =
                explicitPath || getResearchPath(topicOrPayload?.topicKey);

            navigate(resolvedPath || fallbackPath, {
                state: {
                    scroll: {
                        mode: "selector",
                        selector: "#research-area-details-title",
                        block: "start",
                    },
                },
            });
        },
        [navigate],
    );

    return <Home handleActiveResearch={handleActiveResearch} />;
}

export default HomePage;
