import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavButton from "./Nav.Button";
import { resolveTabFromPath } from "../routes/routeUtils";
import "./Nav.css";
import CVL_LAB_LOGO from "../assets/logo.svg";

const MOBILE_NAV_QUERY = "(max-width: 57rem)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NAV_SHOW_AT_TOP_Y = 72;
const NAV_SCROLL_DELTA_THRESHOLD = 4;

const getScrollBehavior = () => {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return "auto";
    }
    return window.matchMedia(REDUCED_MOTION_QUERY).matches ? "auto" : "smooth";
};

const isPrimaryPlainClick = (event) =>
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey;

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [isMobileNav, setIsMobileNav] = useState(() => {
        if (
            typeof window === "undefined" ||
            typeof window.matchMedia !== "function"
        ) {
            return false;
        }
        return window.matchMedia(MOBILE_NAV_QUERY).matches;
    });
    const location = useLocation();
    const selectedTab = resolveTabFromPath(location.pathname);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsNavVisible(true);
    }, [selectedTab]);

    useEffect(() => {
        if (
            typeof window === "undefined" ||
            typeof window.matchMedia !== "function"
        ) {
            return undefined;
        }

        const mediaQueryList = window.matchMedia(MOBILE_NAV_QUERY);
        const syncMobileState = (eventOrList) => {
            const matches =
                "matches" in eventOrList
                    ? eventOrList.matches
                    : mediaQueryList.matches;
            setIsMobileNav(matches);
            if (!matches) {
                setIsMenuOpen(false);
            }
        };

        syncMobileState(mediaQueryList);
        if (typeof mediaQueryList.addEventListener === "function") {
            mediaQueryList.addEventListener("change", syncMobileState);
        } else {
            mediaQueryList.addListener(syncMobileState);
        }

        return () => {
            if (typeof mediaQueryList.removeEventListener === "function") {
                mediaQueryList.removeEventListener("change", syncMobileState);
            } else {
                mediaQueryList.removeListener(syncMobileState);
            }
        };
    }, []);

    useEffect(() => {
        if (!isMobileNav || !isMenuOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isMenuOpen, isMobileNav]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        let previousScrollY = window.scrollY;
        let ticking = false;

        const updateVisibility = () => {
            ticking = false;
            const nextScrollY = window.scrollY;
            const deltaY = nextScrollY - previousScrollY;

            if (isMenuOpen) {
                setIsNavVisible(true);
                previousScrollY = nextScrollY;
                return;
            }

            if (nextScrollY <= NAV_SHOW_AT_TOP_Y) {
                setIsNavVisible(true);
                previousScrollY = nextScrollY;
                return;
            }

            if (Math.abs(deltaY) < NAV_SCROLL_DELTA_THRESHOLD) {
                previousScrollY = nextScrollY;
                return;
            }

            setIsNavVisible(deltaY < 0);
            previousScrollY = nextScrollY;
        };

        const handleScroll = () => {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(updateVisibility);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        if (!isMobileNav) {
            return;
        }
        setIsMenuOpen((prev) => !prev);
        setIsNavVisible(true);
    };

    const handleSelectTab = (_event) => {
        setIsMenuOpen(false);
        setIsNavVisible(true);
    };

    const handleLogoClick = (event) => {
        handleSelectTab(event);
        if (selectedTab !== "home" || !isPrimaryPlainClick(event)) {
            return;
        }

        event.preventDefault();
        window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    };

    const tabs = [
        {
            key: "home",
            label: "Home",
        },
        {
            key: "news",
            label: "News",
            sections: [
                { label: "Filter & Controls", to: "/news#news-controls-title" },
                { label: "Archive", to: "/news#news-archive-title" },
            ],
        },
        {
            key: "research",
            label: "Research",
            sections: [
                {
                    label: "Area Details",
                    to: "/research#research-area-details-title",
                },
                {
                    label: "Resources",
                    to: "/research#research-resources-title",
                },
            ],
        },
        {
            key: "publication",
            label: "Publication",
            sections: [
                {
                    label: "Filter & Search",
                    to: "/publication#publication-controls-title",
                },
                {
                    label: "Archive",
                    to: "/publication#publication-archive-title",
                },
            ],
        },
        {
            key: "people",
            label: "People",
            sections: [
                { label: "Professor", to: "/people#people-section-professor" },
                {
                    label: "Integrated M.S./Ph.D.",
                    to: "/people#people-section-integrated_mp",
                },
                { label: "Alumni", to: "/people#people-section-alumni" },
            ],
        },
        {
            key: "photo",
            label: "Photo",
        },
        {
            key: "contact",
            label: "Contact",
        },
    ];

    return (
        <>
            {isMobileNav ? (
                <div
                    className={`nav__overlay ${isMenuOpen ? "is-visible" : ""}`}
                    onClick={toggleMenu}></div>
            ) : null}
            <div
                className={`nav animated-surface ${isMenuOpen ? "is-menu-open" : ""} ${
                    isNavVisible ? "is-nav-visible" : "is-nav-hidden"
                }`}>
                <div className="nav__header">
                    <Link
                        to="/"
                        state={{ scroll: { mode: "window-top" } }}
                        className="nav__logo"
                        onClick={handleLogoClick}
                        aria-label="Go to Home">
                        <img src={CVL_LAB_LOGO} alt="CVL-Lab logo" />
                    </Link>
                    {isMobileNav ? (
                        <button
                            type="button"
                            className="nav__toggle btn btn--icon btn--sm interactive-button"
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-controls="nav-links"
                            aria-label={
                                isMenuOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }>
                            <span
                                className="nav__toggle-icon"
                                aria-hidden="true">
                                {isMenuOpen ? "✕" : "☰"}
                            </span>
                        </button>
                    ) : null}
                </div>
                <div
                    id="nav-links"
                    className={`nav__links animated-surface ${isMobileNav && !isMenuOpen ? "is-hidden" : ""}`}>
                    {tabs.map((tabItem, i) => (
                        <div
                            key={tabItem.key + i}
                            className={`nav__item ${tabItem.sections?.length ? "has-sections" : ""}`}>
                            <NavButton
                                tabKey={tabItem.key}
                                isSelected={selectedTab === tabItem.key}
                                onSelect={handleSelectTab}>
                                {tabItem.label}
                            </NavButton>

                            {tabItem.sections?.length ? (
                                <div
                                    className="nav__submenu"
                                    role="menu"
                                    aria-label={`${tabItem.label} sections`}>
                                    {tabItem.sections.map((sectionItem) => (
                                        <Link
                                            key={sectionItem.to}
                                            to={sectionItem.to}
                                            className="nav__submenu-link"
                                            role="menuitem"
                                            onClick={handleSelectTab}>
                                            <span>{sectionItem.label}</span>
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
