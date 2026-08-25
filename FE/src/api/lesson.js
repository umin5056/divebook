import client from "./client";

export function updateLessonRequest(lesson, status) {
  return {
    title: lesson.title,
    location: lesson.location,
    lessonDate: lesson.lessonDate,
    startTime: lesson.startTime.slice(-5),
    endTime: lesson.endTime.slice(-5),
    maxStudents: Number(String(lesson.maxStudents).replace(/,/g, "")),
    fee: Number(String(lesson.fee).replace(/,/g, "")),
    content: lesson.content ?? "",
    status,
  };
}

export function getLessons() {
  return client.get("/api/lessons");
}

export function getLessonById(lessonId) {
  return client.get(`/api/lessons/${lessonId}`);
}

export function getLessonsByDate(date) {
  return client.get("/api/lessons", { params: { date } });
}

export function createLesson(data) {
  return client.post("/api/lessons", data);
}

export function updateLesson(lessonId, data) {
  return client.put(`/api/lessons/${lessonId}`, data);
}

export function getLessonEnrollments(lessonId) {
  return client.get(`/api/lessons/${lessonId}/enrollments`);
}

export function updatePaymentStatus(enrollmentId, paymentStatus) {
  return client.patch(`/api/enrollments/${enrollmentId}/paymentStatus`, {
    paymentStatus,
  });
}
