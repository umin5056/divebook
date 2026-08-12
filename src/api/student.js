import client from "./client";

export function getStudents() {
  return client.get("/api/students");
}
