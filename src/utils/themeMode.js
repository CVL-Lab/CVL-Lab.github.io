const THEME_STORAGE_KEY = "cvl-theme";
const THEME_ATTRIBUTE = "data-theme";
const PREFERS_DARK_QUERY = "(prefers-color-scheme: dark)";
export const THEME_CHANGE_EVENT = "cvl-theme-change";

export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

const isValidTheme = (value) => value === LIGHT_THEME || value === DARK_THEME;

export const getDocumentTheme = () => {
    if (typeof document === "undefined") {
        return LIGHT_THEME;
    }

    const themeValue =
        document.documentElement.getAttribute(THEME_ATTRIBUTE) || "";

    return isValidTheme(themeValue) ? themeValue : LIGHT_THEME;
};

const readStoredTheme = () => {
    if (typeof window === "undefined") {
        return "";
    }

    try {
        return window.localStorage.getItem(THEME_STORAGE_KEY) || "";
    } catch {
        return "";
    }
};

const readSystemTheme = () => {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return LIGHT_THEME;
    }

    return window.matchMedia(PREFERS_DARK_QUERY).matches
        ? DARK_THEME
        : LIGHT_THEME;
};

export const resolvePreferredTheme = () => {
    const storedTheme = readStoredTheme();
    if (isValidTheme(storedTheme)) {
        return storedTheme;
    }
    return readSystemTheme();
};

export const persistTheme = (theme) => {
    if (typeof window === "undefined" || !isValidTheme(theme)) {
        return;
    }

    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // no-op: storage can fail in privacy mode
    }
};

export const applyThemeToDocument = (theme) => {
    if (typeof document === "undefined" || !isValidTheme(theme)) {
        return;
    }

    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    document.documentElement.style.colorScheme = theme;

    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent(THEME_CHANGE_EVENT, {
                detail: { theme },
            }),
        );
    }
};
