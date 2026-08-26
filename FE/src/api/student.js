import client from "./client";

export function getStudents() {
  return client.get("/api/students");
}

export function getStudentsDailyTrend() {
  return client.get("/api/students/dailyTrend");
}

export function getStudentsMonthlyTrend() {
  return client.get("/api/students/monthlyTrend");
}

export function updateStudent(studentId, content) {
  return client.patch(`/api/students/${studentId}`, { content });
}
