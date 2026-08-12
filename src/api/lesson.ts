import client from "./client";

export interface CreateLessonRequest {
  title: string;
  location: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  fee: number;
  content: string;
  status: "open" | "closed" | "cancelled";
}

export interface LessonResponse {
  lessonId: string;
  title: string;
  location: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  fee: number;
  content: string;
  status: "open" | "closed" | "cancelled";
  enrollmentCount: number;
}

export interface EnrollmentResponse {
  enrollmentId: string;
  studentId: string;
  name: string;
  phone: string;
  paymentStatus: "pending" | "paid" | "refunded";
}

export function lessonToUpdateRequest(
  lesson: LessonResponse,
  status: CreateLessonRequest["status"],
): CreateLessonRequest {
  return {
    title: lesson.title,
    location: lesson.location,
    lessonDate: lesson.lessonDate,
    startTime: lesson.startTime.slice(-5),
    endTime: lesson.endTime.slice(-5),
    maxStudents: lesson.maxStudents,
    fee: lesson.fee,
    content: lesson.content ?? "",
    status,
  };
}

export function getLessons() {
  return client.get<LessonResponse[]>("/api/lessons");
}

export function createLesson(data: CreateLessonRequest) {
  return client.post("/api/lessons", data);
}

export function updateLesson(lessonId: string, data: CreateLessonRequest) {
  return client.put(`/api/lessons/${lessonId}`, data);
}

export function getLessonEnrollments(lessonId: string) {
  return client.get<EnrollmentResponse[]>(
    `/api/lessons/${lessonId}/enrollments`,
  );
}

export function updatePaymentStatus(
  enrollmentId: string,
  paymentStatus: EnrollmentResponse["paymentStatus"],
) {
  return client.patch(`/api/enrollments/${enrollmentId}/payment-status`, {
    paymentStatus,
  });
}
