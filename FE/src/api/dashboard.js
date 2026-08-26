import client from "./client";

export function getLessonApprovals() {
  return client.get("/api/enrollments/approvals");
}
