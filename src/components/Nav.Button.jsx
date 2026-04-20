import { Link } from "react-router-dom";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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

export default function NavButton({ children, tabKey, isSelected, onSelect }) {
    const to = tabKey === "home" ? "/" : `/${tabKey}`;

    const handleClick = (event) => {
        onSelect?.(event);
        if (!isSelected || !isPrimaryPlainClick(event)) {
            return;
        }

        event.preventDefault();
        window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    };

    return (
        <Link
            to={to}
            state={{ scroll: { mode: "window-top" } }}
            className={`nav__button nav__button--${tabKey} btn btn--sm interactive-button ${isSelected ? "is-active" : ""}`}
            data-tab={tabKey}
            onClick={handleClick}
            aria-current={isSelected ? "page" : undefined}>
            {children}
        </Link>
    );
}
