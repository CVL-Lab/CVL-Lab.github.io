import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import MailIcon from "./icons/MailIcon";
import {
    applyThemeToDocument,
    DARK_THEME,
    getDocumentTheme,
    LIGHT_THEME,
    persistTheme,
    resolvePreferredTheme,
    THEME_CHANGE_EVENT,
} from "../utils/themeMode";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FAB_VISIBILITY_SCROLL_Y = 520;

function BackToTopButton() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [themeMode, setThemeMode] = useState(() => resolvePreferredTheme());

    const getScrollBehavior = () => {
        const prefersReducedMotion =
            window.matchMedia(REDUCED_MOTION_QUERY).matches;
        return prefersReducedMotion ? "auto" : "smooth";
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > FAB_VISIBILITY_SCROLL_Y);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleThemeChange = (event) => {
            const nextTheme = event?.detail?.theme;
            if (nextTheme === DARK_THEME || nextTheme === LIGHT_THEME) {
                setThemeMode(nextTheme);
                return;
            }
            setThemeMode(getDocumentTheme());
        };

        window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        setThemeMode(getDocumentTheme());

        return () => {
            window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        };
    }, []);

    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: getScrollBehavior(),
        });
    };

    const handleContact = () => {
        if (location.pathname === "/contact") {
            handleBackToTop();
            return;
        }
        navigate("/contact");
    };

    const handleToggleTheme = () => {
        const nextTheme = themeMode === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyThemeToDocument(nextTheme);
        persistTheme(nextTheme);
        setThemeMode(nextTheme);
    };

    const nextThemeLabel = themeMode === DARK_THEME ? "light" : "dark";

    return (
        <div
            className={`fab ${isVisible ? "is-visible" : ""}`}
            role="group"
            aria-label="Page quick actions">
            <button
                type="button"
                className="fab__btn fab__btn--theme btn btn--icon btn--secondary interactive-button"
                onClick={handleToggleTheme}
                aria-label={`Switch to ${nextThemeLabel} mode`}>
                <FontAwesomeIcon
                    icon={themeMode === DARK_THEME ? faSun : faMoon}
                    aria-hidden="true"
                />
            </button>
            <button
                type="button"
                className="fab__btn fab__btn--contact btn btn--icon btn--secondary interactive-button"
                onClick={handleContact}
                aria-label="Contact us">
                <MailIcon className="icon-mail" />
            </button>
            <button
                type="button"
                className="fab__btn fab__btn--primary btn btn--icon btn--primary interactive-button"
                onClick={handleBackToTop}
                aria-label="Back to top">
                <FontAwesomeIcon icon={faArrowUp} aria-hidden="true" />
            </button>
        </div>
    );
}

export default BackToTopButton;
