package com.diving.admin.domain.lesson.repository;

import com.diving.admin.domain.lesson.entity.Lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByInstructorIdOrderByLessonDateDesc(Long instructorId);
}
