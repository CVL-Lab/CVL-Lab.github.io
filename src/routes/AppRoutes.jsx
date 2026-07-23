import { Navigate, Route, Routes } from "react-router-dom";
import { PAGE_MANIFEST } from "./pageManifest";
import { RESEARCH_LEGACY_ROUTES } from "../utils/researchData";

function AppRoutes() {
    return (
        <Routes>
            {PAGE_MANIFEST.map((route) => {
                const RouteComponent = route.component;
                return (
                    <Route
                        key={`${route.tabKey}-${route.path}`}
                        path={route.path}
                        element={<RouteComponent />}
                    />
                );
            })}
            {RESEARCH_LEGACY_ROUTES.map((route) => (
                <Route
                    key={`research-legacy-${route.from}`}
                    path={route.from}
                    element={<Navigate to={route.to} replace />}
                />
            ))}
            <Route
                path="/research/*"
                element={<Navigate to="/research" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;
