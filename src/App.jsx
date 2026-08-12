import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/login/LoginPage";
import LessonPage from "./pages/lesson/LessonPage";
import StudentPage from "./pages/student/StudentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/lesson" element={<LessonPage />} />
          <Route path="/student" element={<StudentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
