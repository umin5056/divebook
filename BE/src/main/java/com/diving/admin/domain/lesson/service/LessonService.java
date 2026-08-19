package com.diving.admin.domain.lesson.service;

import com.diving.admin.domain.lesson.dto.CreateLessonRequest;
import com.diving.admin.domain.lesson.dto.LessonResponse;
import com.diving.admin.domain.lesson.dto.UpdateLessonRequest;
import com.diving.admin.domain.lesson.entity.Lesson;
import com.diving.admin.domain.lesson.repository.LessonRepository;

import com.diving.admin.domain.enrollment.repository.EnrollmentRepository;
import com.diving.admin.domain.enrollment.dto.EnrollmentResponse;
import com.diving.admin.domain.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    public List<LessonResponse> getList(Long instructorId) {
        return lessonRepository.findByInstructorIdOrderByLessonDateDesc(instructorId)
                .stream().map(LessonResponse::from).toList();
    }

    public Long create(Long instructorId, CreateLessonRequest request) {
        Lesson lesson = Lesson.create(instructorId, request);
        return lessonRepository.save(lesson).getLessonId();
    }

    @Transactional
    public void update(Long lessonId, UpdateLessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
        lesson.update(request);
    }

    public List<EnrollmentResponse> getEnrollments(Long lessonId) {
        return enrollmentRepository.findByLessonId(lessonId).stream()
                .map(e -> studentRepository.findById(e.getStudentId())
                        .map(s -> EnrollmentResponse.of(e, s))
                        .orElse(null))
                .filter(e -> e != null)
                .toList();
    }
}
