package com.diving.admin.domain.lesson;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateLessonRequest(
        String title,
        String location,
        LocalDate lessonDate,
        LocalTime startTime,
        LocalTime endTime,
        Short maxStudents,
        Integer fee,
        String content,
        LessonStatus status
) {}
