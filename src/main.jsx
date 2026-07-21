import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { getRouterBasename } from "./routes/routerBasename";
import { applyThemeToDocument, resolvePreferredTheme } from "./utils/themeMode";

applyThemeToDocument(resolvePreferredTheme());

const appTree = (
    <StrictMode>
        <BrowserRouter basename={getRouterBasename()}>
            <App />
        </BrowserRouter>
    </StrictMode>
);

const container = document.getElementById("root");
if (!container) {
    throw new Error("Root container not found");
}

const normalizeRoutePath = (pathname = "/") => {
    const normalized = pathname.replace(/\/+$/, "");
    return normalized || "/";
};

const renderedRoute = container.firstElementChild?.getAttribute(
    "data-rendered-route",
);
const canHydrate =
    container.hasChildNodes() &&
    renderedRoute &&
    normalizeRoutePath(renderedRoute) ===
        normalizeRoutePath(window.location.pathname);

if (canHydrate) {
    hydrateRoot(container, appTree);
} else {
    container.replaceChildren();
    createRoot(container).render(appTree);
}
