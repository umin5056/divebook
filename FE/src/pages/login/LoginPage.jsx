import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("savedEmail") ?? "");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(
    !!localStorage.getItem("savedEmail")
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/lesson", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    try {
      const { data } = await login({ email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      if (rememberEmail) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      navigate("/lesson", { replace: true });
    } catch (err) {
      setError(err.response?.data ?? "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="h-full flex justify-center-safe items-center">
      <div className="w-80 flex flex-col gap-10 py-15 px-5 rounded-2xl border border-blue-400 bg-gray-100 shadow-xl shadow-blue-300">
        <div className="flex items-center gap-3">
          <div className="bg-blue-400 p-2 rounded-xl text-3xl">🤿</div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">DIVE BOOK</span>
            <span className="text-xs text-gray-600 font-bold">
              프리다이빙 강습 관리
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
            />
            이메일 저장
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2 font-bold text-white disabled:opacity-50"
          >
            로그인
          </button>

          {error && <span className="text-xs text-red-500">{error}</span>}
        </form>
      </div>
    </div>
  );
}
