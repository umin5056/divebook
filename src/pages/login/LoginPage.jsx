import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailCode, verifyEmailCode } from "../../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await sendEmailCode({ email });
      setStep("code");
    } catch {
      setError("인증코드 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await verifyEmailCode({ email, code });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/lesson", { replace: true });
    } catch {
      setError("인증코드가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex justify-center-safe items-center bg-blue-100">
      <div className="w-80 flex flex-col gap-10 py-15 px-5 rounded-2xl bg-gray-100 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-400 p-2 rounded-xl text-3xl">🤿</div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">DIVE BOOK</span>
            <span className="text-xs text-gray-600 font-bold">
              프리다이빙 강습 관리 시스템
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요."
            disabled={step === "code"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none disabled:bg-gray-200"
          />

          {step === "email" && (
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || !email}
              className="w-full rounded-lg bg-blue-500 py-2 font-bold text-white disabled:opacity-50"
            >
              인증코드 받기
            </button>
          )}

          {step === "code" && (
            <>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6자리 인증코드"
                maxLength={6}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={loading || !code}
                className="w-full rounded-lg bg-blue-500 py-2 font-bold text-white disabled:opacity-50"
              >
                로그인
              </button>
            </>
          )}

          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
    </div>
  );
}
