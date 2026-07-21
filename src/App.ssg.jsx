import { createAppShell } from "./App";
import CvlLab from "./components/tabs/CvlLab";
import AppRoutesSSG from "./routes/AppRoutes.ssg";

const AppSSG = createAppShell(CvlLab, AppRoutesSSG);

export default AppSSG;
