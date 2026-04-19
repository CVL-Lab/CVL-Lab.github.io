import { Navigate, Route, Routes } from "react-router-dom";
import { PAGE_MANIFEST } from "./pageManifest";

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
            <Route
                path="/research/core"
                element={
                    <Navigate
                        to="/research/computer-vision-and-learning-algorithms"
                        replace
                    />
                }
            />
            <Route
                path="/research/multi-modal"
                element={
                    <Navigate
                        to="/research/efficient-learning-for-llms"
                        replace
                    />
                }
            />
            <Route
                path="/research/application"
                element={<Navigate to="/research/robot-learning" replace />}
            />
            <Route
                path="/research/biomedical"
                element={
                    <Navigate
                        to="/research/industrial-and-medical-ai"
                        replace
                    />
                }
            />
            <Route
                path="/research/*"
                element={<Navigate to="/research" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;
