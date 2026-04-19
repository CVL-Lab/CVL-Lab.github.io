import { useLocation } from "react-router-dom";
import Research from "../components/tabs/Research";
import {
    resolveResearchTopic,
    resolveResearchTopicFromPath,
} from "../utils/researchData";

function ResearchPage() {
    const location = useLocation();
    const topicFromPath = resolveResearchTopicFromPath(location.pathname);
    const isBaseResearchRoute =
        location.pathname === "/research" || location.pathname === "/research/";
    const selectedResearchTopic = topicFromPath
        ? topicFromPath
        : isBaseResearchRoute
          ? null
          : (resolveResearchTopic(location.state?.selectedResearchTopic) ??
            null);

    return <Research selectedResearchTopic={selectedResearchTopic} />;
}

export default ResearchPage;
