import { Link } from "react-router-dom";
import { scrollWindowTo } from "../utils/scrollMotion";

const isPrimaryPlainClick = (event) =>
    (event.button === undefined || event.button === 0) &&
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
        scrollWindowTo({ top: 0 });
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
