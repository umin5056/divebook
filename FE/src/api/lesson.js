import client from "./client";

export function lessonToUpdateRequest(lesson, status) {
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
  return client.get("/api/lessons");
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
