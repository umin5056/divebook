import client from "./client";

export function getApprovalDashboard() {
  return client.get("/api/enrollments/approvals");
}
