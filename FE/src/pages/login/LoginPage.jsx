import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailCode, verifyEmailCode } from "../../api/auth";

const RESEND_COOLDOWN_SECONDS = 5;

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendCode = async () => {
    if (cooldown > 0) return;
    if (!email) {
      setError("이메일을 입력해주세요");
      return;
    }
    try {
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SECONDS);
      await sendEmailCode({ email });
    } catch {
      setError("인증코드 발송에 실패했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError("인증코드를 입력해주세요.");
      return;
    }
    try {
      const { data } = await verifyEmailCode({ email, code });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/lesson", { replace: true });
    } catch (err) {
      setError(err.response?.data ?? "인증코드가 올바르지 않습니다.");
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

        <div className="flex flex-col gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCode();
            }}
            className="flex gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none disabled:bg-gray-200"
            />
            <button
              type="submit"
              disabled={cooldown > 0}
              className="whitespace-nowrap rounded-lg bg-blue-500 p-2 font-bold text-white disabled:opacity-50"
            >
              {cooldown > 0 ? `전송중` : step === "email" ? "전송" : "재전송"}
            </button>
          </form>

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
