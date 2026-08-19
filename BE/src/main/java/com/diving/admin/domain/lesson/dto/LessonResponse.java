package com.diving.admin.domain.lesson.dto;

import com.diving.admin.domain.lesson.entity.Lesson;
import com.diving.admin.domain.lesson.entity.LessonStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;

public record LessonResponse(
        Long lessonId,
        String title,
        String location,
        LocalDate lessonDate,
        @JsonFormat(pattern = "a hh:mm", locale = "ko") LocalTime startTime,
        @JsonFormat(pattern = "a hh:mm", locale = "ko") LocalTime endTime,
        Short maxStudents,
        Integer fee,
        String content,
        LessonStatus status,
        int enrollmentCount
) {
    public static LessonResponse from(Lesson lesson) {
        return new LessonResponse(
                lesson.getLessonId(),
                lesson.getTitle(),
                lesson.getLocation(),
                lesson.getLessonDate(),
                lesson.getStartTime(),
                lesson.getEndTime(),
                lesson.getMaxStudents(),
                lesson.getFee(),
                lesson.getContent(),
                lesson.getStatus(),
                lesson.getEnrollmentCount()
        );
    }
}
