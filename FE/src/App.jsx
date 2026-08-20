import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/auth/LoginPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import SignupPage from "./pages/auth/SignupPage";
import LessonPage from "./pages/lesson/LessonPage";
import StudentPage from "./pages/student/StudentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/findPassword" element={<FindPasswordPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<LessonPage />} />
          <Route path="/lesson" element={<LessonPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/setting" element={<LessonPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
