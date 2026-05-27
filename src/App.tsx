import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/login/LoginPage";
import AuthCallbackPage from "./pages/login/AuthCallbackPage";
import LessonPage from "./pages/lesson/LessonPage";
import AddLessonPage from "./pages/lesson/AddLessonPage";
import CrewPage from "./pages/crew/CrewPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route element={<Layout />}>
          <Route path="/lesson" element={<LessonPage />} />
          <Route path="/lesson/add" element={<AddLessonPage />} />
          <Route path="/crew" element={<CrewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
