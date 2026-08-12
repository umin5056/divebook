import client from "./client";

export interface StudentResponse {
  studentId: string;
  instructorId: string;
  phone: string;
  name: string;
  email: string;
  content: string;
  deleted: string;
}

export function getStudents() {
  return client.get<StudentResponse[]>("/api/students");
}
