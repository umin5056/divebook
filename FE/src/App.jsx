import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toast } from "konsta/react";
import { Layout } from "./components/Layout";
import { useToastStore } from "./store/useToastStore";
import LoginPage from "./pages/auth/LoginPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import LessonPage from "./pages/lesson/LessonPage";
import LessonAddPage from "./pages/lesson/LessonAddPage";
import LessonDetailPage from "./pages/lesson/LessonDetailPage";
import StudentPage from "./pages/StudentPage";
import SettingPage from "./pages/SettingPage";

export default function App() {
  const { message } = useToastStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/findPassword" element={<FindPasswordPage />} />
        <Route path="/lesson/new" element={<LessonAddPage />} />
        <Route path="/lesson/:lessonId" element={<LessonDetailPage />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lessons" element={<LessonPage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/setting" element={<SettingPage />} />
        </Route>
      </Routes>
      <Toast opened={!!message} position="center">
        <div className="shrink">{message}</div>
      </Toast>
    </BrowserRouter>
  );
}
