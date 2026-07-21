import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavButton from "./Nav.Button";
import { resolveTabFromPath } from "../routes/routeUtils";
import {
    DARK_THEME,
    getDocumentTheme,
    LIGHT_THEME,
    THEME_CHANGE_EVENT,
} from "../utils/themeMode";
import {
    PROGRAMMATIC_SCROLL_EVENT,
    scrollWindowTo,
} from "../utils/scrollMotion";
import "./Nav.css";
import CVL_LAB_LOGO_LIGHT from "../assets/logo-light.svg";
import CVL_LAB_LOGO_DARK from "../assets/logo-dark.svg";

const MOBILE_NAV_QUERY = "(max-width: 57rem)";
const NAV_SHOW_AT_TOP_Y = 72;
const NAV_SCROLL_DELTA_THRESHOLD = 4;
const NAV_RETURN_ANIMATION_MS = 430;
const PROGRAMMATIC_SCROLL_GUARD_MS = 520;

const isPrimaryPlainClick = (event) =>
    (event.button === undefined || event.button === 0) &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey;

const getSectionScrollState = (target) => {
    const hashStart = target.indexOf("#");
    if (hashStart < 0) {
        return undefined;
    }

    return {
        scroll: {
            mode: "selector",
            selector: target.slice(hashStart),
            block: "start",
        },
    };
};

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [isNavReturning, setIsNavReturning] = useState(false);
    const [isMobileNav, setIsMobileNav] = useState(false);
    const [themeMode, setThemeMode] = useState(LIGHT_THEME);
    const isNavVisibleRef = useRef(true);
    const navReturnTimeoutRef = useRef(null);
    const programmaticScrollUntilRef = useRef(0);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedTab = resolveTabFromPath(location.pathname);

    const clearNavReturnTimer = useCallback(() => {
        if (navReturnTimeoutRef.current === null) {
            return;
        }

        window.clearTimeout(navReturnTimeoutRef.current);
        navReturnTimeoutRef.current = null;
    }, []);

    const showNav = useCallback(({ animate = false } = {}) => {
        const wasHidden = !isNavVisibleRef.current;

        isNavVisibleRef.current = true;
        setIsNavVisible(true);

        if (!animate || !wasHidden) {
            clearNavReturnTimer();
            setIsNavReturning(false);
            return;
        }

        clearNavReturnTimer();
        setIsNavReturning(false);
        window.requestAnimationFrame(() => {
            setIsNavReturning(true);
            navReturnTimeoutRef.current = window.setTimeout(() => {
                setIsNavReturning(false);
                navReturnTimeoutRef.current = null;
            }, NAV_RETURN_ANIMATION_MS);
        });
    }, [clearNavReturnTimer]);

    const hideNav = useCallback(() => {
        isNavVisibleRef.current = false;
        clearNavReturnTimer();
        setIsNavReturning(false);
        setIsNavVisible(false);
    }, [clearNavReturnTimer]);

    useEffect(() => {
        const handleThemeChange = (event) => {
            const nextTheme = event?.detail?.theme;
            if (nextTheme === DARK_THEME || nextTheme === LIGHT_THEME) {
                setThemeMode(nextTheme);
                return;
            }
            setThemeMode(getDocumentTheme());
        };

        if (typeof window !== "undefined") {
            window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        }

        setThemeMode(getDocumentTheme());

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener(
                    THEME_CHANGE_EVENT,
                    handleThemeChange,
                );
            }
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        showNav({ animate: false });
    }, [location.pathname, location.hash, showNav]);

    useEffect(() => {
        return () => {
            clearNavReturnTimer();
        };
    }, [clearNavReturnTimer]);

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

        const handleProgrammaticScroll = (event) => {
            const duration = Number(event?.detail?.duration);
            programmaticScrollUntilRef.current =
                window.performance.now() +
                (Number.isFinite(duration) ? duration : 700) +
                PROGRAMMATIC_SCROLL_GUARD_MS;
            showNav({ animate: false });
        };
        let previousScrollY = window.scrollY;
        let ticking = false;

        const updateVisibility = () => {
            ticking = false;
            const nextScrollY = window.scrollY;
            const deltaY = nextScrollY - previousScrollY;

            if (window.performance.now() < programmaticScrollUntilRef.current) {
                showNav({ animate: false });
                previousScrollY = nextScrollY;
                return;
            }

            if (isMenuOpen) {
                showNav({ animate: false });
                previousScrollY = nextScrollY;
                return;
            }

            if (nextScrollY <= NAV_SHOW_AT_TOP_Y) {
                showNav({ animate: false });
                previousScrollY = nextScrollY;
                return;
            }

            if (Math.abs(deltaY) < NAV_SCROLL_DELTA_THRESHOLD) {
                previousScrollY = nextScrollY;
                return;
            }

            if (deltaY < 0) {
                showNav({ animate: true });
            } else {
                hideNav();
            }
            previousScrollY = nextScrollY;
        };

        const handleScroll = () => {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(updateVisibility);
        };

        window.addEventListener(
            PROGRAMMATIC_SCROLL_EVENT,
            handleProgrammaticScroll,
        );
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener(
                PROGRAMMATIC_SCROLL_EVENT,
                handleProgrammaticScroll,
            );
            window.removeEventListener("scroll", handleScroll);
        };
    }, [hideNav, isMenuOpen, showNav]);

    const toggleMenu = () => {
        if (!isMobileNav) {
            return;
        }
        setIsMenuOpen((prev) => !prev);
        showNav({ animate: false });
    };

    const handleSelectTab = (event) => {
        if (event?.currentTarget instanceof HTMLElement) {
            event.currentTarget.blur();
        }

        setIsMenuOpen(false);
        showNav({ animate: false });
    };

    const handleLogoClick = (event) => {
        handleSelectTab(event);
        if (selectedTab !== "home" || !isPrimaryPlainClick(event)) {
            return;
        }

        event.preventDefault();
        scrollWindowTo({ top: 0 });
    };

    const handleSectionSelect = (event, target) => {
        handleSelectTab(event);
        if (!isPrimaryPlainClick(event)) {
            return;
        }

        event.preventDefault();
        navigate(target, {
            state: getSectionScrollState(target),
        });
    };

    const navLogoSrc =
        themeMode === DARK_THEME ? CVL_LAB_LOGO_DARK : CVL_LAB_LOGO_LIGHT;

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
                className={`nav animated-surface ${isMenuOpen ? "is-menu-open" : ""} ${isNavReturning ? "is-nav-returning" : ""} ${
                    isNavVisible ? "is-nav-visible" : "is-nav-hidden"
                }`}>
                <div className="nav__header">
                    <Link
                        to="/"
                        state={{ scroll: { mode: "window-top" } }}
                        className="nav__logo"
                        onClick={handleLogoClick}
                        aria-label="Go to Home">
                        <img
                            src={navLogoSrc}
                            alt="CVL-Lab logo"
                            decoding="async"
                            fetchPriority="high"
                        />
                    </Link>
                    {isMobileNav ? (
                        <div className="nav__header-actions">
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
                        </div>
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
                                            state={getSectionScrollState(
                                                sectionItem.to,
                                            )}
                                            className="nav__submenu-link"
                                            role="menuitem"
                                            onClick={(event) =>
                                                handleSectionSelect(
                                                    event,
                                                    sectionItem.to,
                                                )
                                            }>
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
