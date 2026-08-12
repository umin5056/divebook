import client from "./client";

export function sendEmailCode(data) {
  return client.post("/api/auth/email/send", data);
}

export function verifyEmailCode(data) {
  return client.post("/api/auth/email/verify", data);
}
