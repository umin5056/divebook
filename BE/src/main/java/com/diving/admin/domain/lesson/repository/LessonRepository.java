package com.diving.admin.domain.lesson.repository;

import com.diving.admin.domain.lesson.entity.Lesson;
import com.diving.admin.domain.lesson.entity.LessonStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByInstructorIdOrderByLessonDate(Long instructorId);
    List<Lesson> findByInstructorIdAndLessonDateOrderByLessonDate(Long instructorId, LocalDate lessonDate);
    Optional<Lesson> findByLessonIdAndInstructorId(Long lessonId, Long instructorId);
    long countByInstructorIdAndStatusNotAndCreatedAtLessThanEqual(Long instructorId, LessonStatus status, LocalDateTime createdAt);
}