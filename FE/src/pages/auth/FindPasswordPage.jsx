import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock } from "lucide-react";
import { sendCode, loginWithCode, resetPassword, logout } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import AuthFooterLink from "../../components/auth/AuthFooterLink";
import AuthBackButton from "../../components/auth/AuthBackButton";
import usePasswordConfirm, {
  MIN_PASSWORD_LENGTH,
} from "../../hooks/usePasswordConfirm";

export default function FindPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const {
    password,
    passwordConfirm,
    handleInputPassword,
    handleInputPasswordConfirm,
    resetPasswordFields,
  } = usePasswordConfirm(setError);

  const handleGoBack = () => {
    setError("");
    switch (step) {
      case "code":
        setStep("email");
        break;
      case "reset":
        setStep("code");
        break;
    }
  };

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    try {
      setError("");
      setStep("code");
      await sendCode({ email: email.trim() });
    } catch (err) {
      setError(err.response?.data ?? "인증코드 발송에 실패했습니다.");
      setStep("email");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError("인증코드를 입력해주세요.");
      return;
    }
    try {
      await loginWithCode({
        email: email.trim(),
        code: code.trim(),
      });
      setError("");
      resetPasswordFields();
      setStep("reset");
    } catch (err) {
      setError(err.response?.data ?? "인증코드가 올바르지 않습니다.");
    }
  };

  const handleResetPassword = async () => {
    if (!password || !passwordConfirm) {
      setError("비밀번호를 모두 입력해주세요.");
      return;
    }
    if (
      password.length < MIN_PASSWORD_LENGTH ||
      passwordConfirm.length < MIN_PASSWORD_LENGTH
    ) {
      setError(`${MIN_PASSWORD_LENGTH}자리 이상 입력해주세요.`);
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await resetPassword({ email: email.trim(), password });
      alert("비밀번호가 변경되었습니다.");
      logout();
    } catch (err) {
      setError(err.response?.data ?? "비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <AuthLayout title="비밀번호 재설정">
      {step === "email" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendCode();
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
          <AuthSubmitButton>인증코드 보내기</AuthSubmitButton>
        </form>
      )}

      {step === "code" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyCode();
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <div className="font-bold text-gray-500 mb-2">인증코드</div>
            <AuthInput
              icon={KeyRound}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="이메일로 받은 인증코드 입력"
            />
          </div>
          <AuthSubmitButton>인증하기</AuthSubmitButton>
        </form>
      )}

      {step === "reset" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <div className="font-bold text-gray-500 mb-2">새 비밀번호</div>
            <AuthInput
              icon={Lock}
              type="password"
              value={password}
              onChange={handleInputPassword}
              placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
            />
          </div>
          <div>
            <div className="font-bold text-gray-500 mb-2">새 비밀번호 확인</div>
            <AuthInput
              icon={Lock}
              type="password"
              value={passwordConfirm}
              onChange={handleInputPasswordConfirm}
              placeholder="비밀번호 재입력"
            />
          </div>
          <AuthSubmitButton>비밀번호 변경</AuthSubmitButton>
        </form>
      )}
      <AuthBackButton visible={step !== "email"} onClick={handleGoBack} />
      {error && <span className="text-xs font-bold text-red-700">{error}</span>}

      <AuthFooterLink
        linkText="로그인으로 돌아가기"
        onClick={() => navigate("/")}
      />
    </AuthLayout>
  );
}
