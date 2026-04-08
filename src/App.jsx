import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTopButton from "./components/BackToTopButton";
import RouteScrollManager from "./components/RouteScrollManager";
import AppRoutes from "./routes/AppRoutes";
import { resolveTabFromPath } from "./routes/routeUtils";
import "./App.css";

const CvlLab = lazy(() => import("./components/tabs/CvlLab"));

function App() {
    const location = useLocation();
    const selectedTab = resolveTabFromPath(location.pathname);
    const appClassName = "app";

    return (
        <div className={appClassName}>
            <ScrollProgress />
            <RouteScrollManager />
            <div className="app__content site-shell">
                <Nav />
                {selectedTab === "home" ? (
                    <Suspense
                        fallback={
                            <div
                                className="app__hero-loading"
                                aria-hidden="true"
                            />
                        }>
                        <CvlLab isHome />
                    </Suspense>
                ) : null}
                <MainContent selectedTab={selectedTab}>
                    <AppRoutes />
                </MainContent>
            </div>
            <BackToTopButton />
            <Footer />
        </div>
    );
}

export default App;
