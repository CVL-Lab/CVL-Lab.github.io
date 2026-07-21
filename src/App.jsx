import { Suspense, lazy, useEffect, useRef } from "react";
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

function InteractiveBackdrop() {
    const backdropRef = useRef(null);

    useEffect(() => {
        const node = backdropRef.current;
        if (!node || typeof window === "undefined") {
            return undefined;
        }

        const motionQuery = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        );
        const pointerQuery = window.matchMedia?.(
            "(hover: hover) and (pointer: fine)",
        );
        let frameId = 0;
        let scrollFrameId = 0;
        let latestPointer = null;
        let latestScrollY = window.scrollY;

        const writePointer = () => {
            frameId = 0;
            if (!latestPointer) {
                return;
            }

            const x = Math.min(
                1,
                Math.max(0, latestPointer.clientX / window.innerWidth),
            );
            const y = Math.min(
                1,
                Math.max(0, latestPointer.clientY / window.innerHeight),
            );

            node.style.setProperty("--backdrop-x", x.toFixed(4));
            node.style.setProperty("--backdrop-y", y.toFixed(4));
            node.style.setProperty(
                "--backdrop-left",
                `${(x * 100).toFixed(2)}%`,
            );
            node.style.setProperty(
                "--backdrop-top",
                `${(y * 100).toFixed(2)}%`,
            );
            node.style.setProperty(
                "--backdrop-shift-x",
                `${((x - 0.5) * -28).toFixed(2)}px`,
            );
            node.style.setProperty(
                "--backdrop-shift-y",
                `${((y - 0.5) * -20).toFixed(2)}px`,
            );
            node.style.setProperty(
                "--backdrop-band-shift-x",
                `${((x - 0.5) * 15).toFixed(2)}px`,
            );
            node.style.setProperty(
                "--backdrop-band-shift-y",
                `${((y - 0.5) * 7).toFixed(2)}px`,
            );
        };

        const handlePointerMove = (event) => {
            latestPointer = event;
            if (!frameId) {
                frameId = window.requestAnimationFrame(writePointer);
            }
        };

        const writeScroll = () => {
            scrollFrameId = 0;
            node.style.setProperty(
                "--backdrop-scroll",
                `${Math.round(latestScrollY % 180)}px`,
            );
            node.style.setProperty(
                "--backdrop-scroll-shift",
                `${Math.round((latestScrollY % 180) * -0.08)}px`,
            );
        };

        const handleScroll = () => {
            latestScrollY = window.scrollY;
            if (!scrollFrameId) {
                scrollFrameId = window.requestAnimationFrame(writeScroll);
            }
        };

        const canAnimate =
            !motionQuery?.matches && (pointerQuery?.matches ?? true);
        if (!canAnimate) {
            writeScroll();
            return undefined;
        }

        window.addEventListener("pointermove", handlePointerMove, {
            passive: true,
        });
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("scroll", handleScroll);
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
            if (scrollFrameId) {
                window.cancelAnimationFrame(scrollFrameId);
            }
        };
    }, []);

    return (
        <div className="app-backdrop" ref={backdropRef} aria-hidden="true">
            <div className="app-backdrop__grid" />
            <div className="app-backdrop__band" />
            <div className="app-backdrop__cursor" />
        </div>
    );
}

function App() {
    const location = useLocation();
    const selectedTab = resolveTabFromPath(location.pathname);
    const appClassName = `app app--${selectedTab || "home"}`;

    return (
        <div className={appClassName}>
            <InteractiveBackdrop />
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
