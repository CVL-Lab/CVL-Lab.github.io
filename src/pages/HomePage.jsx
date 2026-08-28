import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/tabs/Home";
import { getResearchPath, resolveResearchTopic } from "../utils/researchData";

function HomePage() {
    const navigate = useNavigate();

    const handleActiveResearch = useCallback(
        (topicOrPayload) => {
            const fallbackPath = "/research";
            const rawTopic =
                typeof topicOrPayload === "string"
                    ? topicOrPayload
                    : topicOrPayload?.topicKey;
            const topicKey = resolveResearchTopic(rawTopic);

            const explicitPath =
                topicOrPayload && typeof topicOrPayload.path === "string"
                    ? topicOrPayload.path
                    : null;
            const resolvedPath =
                explicitPath || getResearchPath(rawTopic) || fallbackPath;

            navigate(resolvedPath, {
                state: {
                    scroll: topicKey
                        ? {
                              mode: "selector",
                              selector: `#research-panel-${topicKey}`,
                              block: "start",
                          }
                        : {
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
