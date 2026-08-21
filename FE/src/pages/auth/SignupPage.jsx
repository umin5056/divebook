import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, KeyRound } from "lucide-react";
import { sendCode, checkEmailCode, signup } from "../../api/auth";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import AuthFooterLink from "../../components/auth/AuthFooterLink";
import AuthBackButton from "../../components/auth/AuthBackButton";
import PolicyModal from "../../components/auth/PolicyModal";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "./policyText";
import usePasswordConfirm, {
  MIN_PASSWORD_LENGTH,
} from "../../hooks/usePasswordConfirm";

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [policyChecked, setPolicyChecked] = useState(false);
  const [termsOpened, setTermsOpened] = useState(false);
  const [privacyOpened, setPrivacyOpened] = useState(false);
  const {
    password,
    passwordConfirm,
    handleInputPassword,
    handleInputPasswordConfirm,
  } = usePasswordConfirm(setError);

  const handleGoBack = () => {
    setError("");
    switch (step) {
      case "code":
        setStep("info");
        break;
      case "password":
        setStep("code");
        break;
    }
  };

  const handleSendCode = async () => {
    if (!name.trim() || !email.trim()) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setStep("code");
      await sendCode({ email: email.trim() });
    } catch (err) {
      setError(err.response?.data ?? "인증코드 발송에 실패했습니다.");
      setStep("info");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError("인증코드를 입력해주세요.");
      return;
    }
    try {
      await checkEmailCode({ email: email.trim(), code: code.trim() });
      setError("비밀번호를 모두 입력해주세요.");
      setStep("password");
    } catch (err) {
      setError(err.response?.data ?? "인증코드가 올바르지 않습니다.");
    }
  };

  const handlePolicyCheck = (e) => {
    setPolicyChecked(e.target.checked);
  };

  const handleSignup = async () => {
    if (!password || !passwordConfirm) {
      setError("비밀번호를 모두 입력해주세요.");
      return;
    }
    if (
      passwordConfirm.length < MIN_PASSWORD_LENGTH ||
      password.length < MIN_PASSWORD_LENGTH
    ) {
      setError(`${MIN_PASSWORD_LENGTH}자리 이상 입력해주세요.`);
      return;
    }
    if (passwordConfirm !== password) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!policyChecked) {
      setError("약관에 동의해주세요.");
      return;
    }

    try {
      const { data } = await signup({
        name,
        email: email.trim(),
        password,
        code: code.trim(),
      });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/lesson", { replace: true });
    } catch (err) {
      setError(err.response?.data ?? "회원가입에 실패했습니다.");
    }
  };

  return (
    <AuthLayout title="회원가입" subtitle="DiveBook 강사 계정을 만들어 주세요.">
      {step === "info" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendCode();
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <div className="font-bold text-gray-500 mb-2">이름</div>
            <AuthInput
              icon={User}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
            />
          </div>
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
      {step === "password" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <div className="font-bold text-gray-500 mb-2">비밀번호</div>
            <AuthInput
              icon={Lock}
              type="password"
              value={password}
              onChange={handleInputPassword}
              placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
            />
          </div>
          <div>
            <div className="font-bold text-gray-500 mb-2">비밀번호 확인</div>
            <AuthInput
              icon={Lock}
              type="password"
              value={passwordConfirm}
              onChange={handleInputPasswordConfirm}
              placeholder="비밀번호 재입력"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-500 font-bold">
            <input
              type="checkbox"
              checked={policyChecked}
              onChange={handlePolicyCheck}
            />
            <span
              className="text-[#008080] cursor-pointer"
              onClick={() => setTermsOpened(true)}
            >
              이용약관
            </span>
            및
            <span
              className="text-[#008080] cursor-pointer"
              onClick={() => setPrivacyOpened(true)}
            >
              개인정보 처리방침
            </span>
            에
            동의합니다.
          </label>
          <AuthSubmitButton>회원가입 완료</AuthSubmitButton>
        </form>
      )}
      <AuthBackButton visible={step !== "info"} onClick={handleGoBack} />
      {error && <span className="text-xs font-bold text-red-700">{error}</span>}

      <AuthFooterLink
        text="이미 계정이 있으신가요?"
        linkText="로그인"
        onClick={() => navigate("/")}
      />

      <PolicyModal
        opened={termsOpened}
        onClose={() => setTermsOpened(false)}
        title="이용약관"
      >
        {TERMS_OF_SERVICE}
      </PolicyModal>
      <PolicyModal
        opened={privacyOpened}
        onClose={() => setPrivacyOpened(false)}
        title="개인정보 처리방침"
      >
        {PRIVACY_POLICY}
      </PolicyModal>
    </AuthLayout>
  );
}
