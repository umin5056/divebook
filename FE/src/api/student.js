import client from "./client";

export function getStudents() {
  return client.get("/api/students");
}

export function updateStudent(studentId, content) {
  return client.patch(`/api/students/${studentId}`, { content });
}
