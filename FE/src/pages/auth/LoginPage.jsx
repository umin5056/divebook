import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { login } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import AuthFooterLink from "../../components/auth/AuthFooterLink";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("savedEmail") ?? "");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(
    !!localStorage.getItem("savedEmail"),
  );
  const [error, setError] = useState("");

  const defaultURI = "/dashboard";

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate(defaultURI, { replace: true });
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
      navigate(defaultURI, { replace: true });
    } catch (err) {
      setError(
        err.response?.data ?? "이메일 또는 비밀번호가 올바르지 않습니다.",
      );
    }
  };

  return (
    <AuthLayout title="로그인" subtitle="DiveBook에 오신 것을 환영합니다.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="flex flex-col gap-3"
      >
        <div>
          <div className="font-bold text-gray-500 mb-2">이메일</div>
          <AuthInput
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-gray-500">비밀번호</span>
            <span
              className="text-[#008080] font-bold cursor-pointer"
              onClick={() => navigate("/findPassword")}
            >
              비밀번호 찾기
            </span>
          </div>
          <AuthInput
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-500 font-bold">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
          />
          이메일 저장
        </label>
        <AuthSubmitButton>로그인</AuthSubmitButton>
        {error && (
          <span className="text-xs font-bold text-red-700">{error}</span>
        )}
      </form>
      <AuthFooterLink
        text="아직 계정이 없으신가요?"
        linkText="회원가입"
        onClick={() => navigate("/signup")}
      />
    </AuthLayout>
  );
}
