import client from "./client";

export function sendCode(data) {
  return client.post("/api/auth/email/send", data);
}

// 가입된 사용자의 이메일 코드 검증 + 로그인
export function loginWithCode(data) {
  return client.post("/api/auth/email/loginWithCode", data);
}

// 미가입 사용자의 이메일 코드 검증
export function checkEmailCode(data) {
  return client.post("/api/auth/email/checkEmailCode", data);
}

export function login(data) {
  return client.post("/api/auth/login", data);
}

export async function logout() {
  try {
    await client.post("/api/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  }
}

export function signup(data) {
  return client.post("/api/auth/signup", data);
}

export function resetPassword(data) {
  return client.patch("/api/auth/password", data);
}
