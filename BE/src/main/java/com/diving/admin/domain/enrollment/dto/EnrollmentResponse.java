package com.diving.admin.domain.enrollment.dto;

import com.diving.admin.domain.enrollment.entity.Enrollment;
import com.diving.admin.domain.enrollment.entity.PaymentStatus;

import com.diving.admin.domain.lesson.entity.Lesson;
import com.diving.admin.domain.student.entity.Student;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;

public record EnrollmentResponse(
        Long enrollmentId,
        Long studentId,
        String name,
        String phone,
        PaymentStatus paymentStatus,
        Long lessonId,
        String lessonTitle,
        String lessonLocation,
        LocalDate lessonDate,
        @JsonFormat(pattern = "a hh:mm", locale = "ko") LocalTime lessonStartTime,
        @JsonFormat(pattern = "a hh:mm", locale = "ko") LocalTime lessonEndTime,
        Integer fee
) {
    public static EnrollmentResponse of(Enrollment enrollment, Student student, Lesson lesson) {
        return new EnrollmentResponse(
                enrollment.getEnrollmentId(),
                student.getStudentId(),
                student.getName(),
                student.getPhone(),
                enrollment.getPaymentStatus(),
                lesson.getLessonId(),
                lesson.getTitle(),
                lesson.getLocation(),
                lesson.getLessonDate(),
                lesson.getStartTime(),
                lesson.getEndTime(),
                lesson.getFee()
        );
    }
}
