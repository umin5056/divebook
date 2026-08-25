package com.diving.admin.domain.lesson.repository;

import com.diving.admin.domain.lesson.entity.Lesson;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByInstructorIdOrderByLessonDate(Long instructorId);
    List<Lesson> findByInstructorIdAndLessonDateOrderByLessonDate(Long instructorId, LocalDate lessonDate);
    Optional<Lesson> findByLessonIdAndInstructorId(Long lessonId, Long instructorId);
}
