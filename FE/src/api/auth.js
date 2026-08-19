import client from "./client";

export function sendEmailCode(data) {
  return client.post("/api/auth/email/send", data);
}

export function verifyEmailCode(data) {
  return client.post("/api/auth/email/verify", data);
}

export function login(data) {
  return client.post("/api/auth/login", data);
}
