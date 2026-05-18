import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomeFeedPage } from "./pages/HomeFeedPage";
import { ShortsPage } from "./pages/ShortsPage";
import { WatchPage } from "./pages/WatchPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeFeedPage />} />
        <Route path="/shorts" element={<ShortsPage />} />
      </Route>
      <Route path="/watch/:videoId" element={<WatchPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
