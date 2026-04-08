import { useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import CvlLab from "./components/tabs/CvlLab";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTopButton from "./components/BackToTopButton";
import AppRoutesSSG from "./routes/AppRoutes.ssg";
import { resolveTabFromPath } from "./routes/routeUtils";
import "./App.css";

function AppSSG() {
    const location = useLocation();
    const selectedTab = resolveTabFromPath(location.pathname);
    const appClassName = "app";

    return (
        <div className={appClassName}>
            <ScrollProgress />
            <div className="app__content site-shell">
                <Nav />
                {selectedTab === "home" ? <CvlLab isHome /> : null}
                <MainContent selectedTab={selectedTab}>
                    <AppRoutesSSG />
                </MainContent>
            </div>
            <BackToTopButton />
            <Footer />
        </div>
    );
}

export default AppSSG;
