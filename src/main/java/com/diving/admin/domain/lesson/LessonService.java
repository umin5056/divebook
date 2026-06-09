package com.diving.admin.domain.lesson;

import com.diving.admin.domain.enrollment.EnrollmentRepository;
import com.diving.admin.domain.enrollment.EnrollmentResponse;
import com.diving.admin.domain.student.StudentRepository;
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

    public List<LessonResponse> getList(String instructorId) {
        return lessonRepository.findByInstructorIdOrderByLessonDateDesc(instructorId)
                .stream().map(LessonResponse::from).toList();
    }

    public String create(String instructorId, CreateLessonRequest request) {
        Lesson lesson = Lesson.create(instructorId, request);
        return lessonRepository.save(lesson).getLessonId();
    }

    @Transactional
    public void update(String lessonId, UpdateLessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
        lesson.update(request);
    }

    public List<EnrollmentResponse> getEnrollments(String lessonId) {
        return enrollmentRepository.findByLessonId(lessonId).stream()
                .map(e -> studentRepository.findById(e.getStudentId())
                        .map(s -> EnrollmentResponse.of(e, s))
                        .orElse(null))
                .filter(e -> e != null)
                .toList();
    }
}
