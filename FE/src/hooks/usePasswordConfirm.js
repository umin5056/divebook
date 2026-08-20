import { useState } from "react";

export const MIN_PASSWORD_LENGTH = 8;

export default function usePasswordConfirm(setError) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const validate = (value, other) => {
    if (!value || !other) {
      setError("비밀번호를 모두 입력해주세요.");
    } else if (value.length < MIN_PASSWORD_LENGTH || other.length < MIN_PASSWORD_LENGTH) {
      setError(`${MIN_PASSWORD_LENGTH}자리 이상 입력해주세요.`);
    } else if (value !== other) {
      setError("비밀번호가 일치하지 않습니다.");
    } else {
      setError("");
    }
  };

  const handleInputPassword = (e) => {
    validate(e.target.value, passwordConfirm);
    setPassword(e.target.value);
  };

  const handleInputPasswordConfirm = (e) => {
    validate(e.target.value, password);
    setPasswordConfirm(e.target.value);
  };

  const resetPasswordFields = () => {
    setPassword("");
    setPasswordConfirm("");
  };

  return {
    password,
    passwordConfirm,
    handleInputPassword,
    handleInputPasswordConfirm,
    resetPasswordFields,
  };
}
