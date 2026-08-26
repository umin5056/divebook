package com.diving.admin.domain.lesson.service;

import com.diving.admin.domain.lesson.dto.CreateLessonRequest;
import com.diving.admin.domain.lesson.dto.LessonResponse;
import com.diving.admin.domain.lesson.dto.LessonTrendResponse;
import com.diving.admin.domain.lesson.dto.UpdateLessonRequest;
import com.diving.admin.domain.lesson.entity.Lesson;
import com.diving.admin.domain.lesson.entity.LessonStatus;

import com.diving.admin.domain.lesson.repository.LessonRepository;

import com.diving.admin.domain.enrollment.repository.EnrollmentRepository;
import com.diving.admin.domain.enrollment.dto.EnrollmentResponse;
import com.diving.admin.domain.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    public List<LessonResponse> getList(Long instructorId, LocalDate date) {
        List<Lesson> lessons = date == null
                ? lessonRepository.findByInstructorIdOrderByLessonDate(instructorId)
                : lessonRepository.findByInstructorIdAndLessonDateOrderByLessonDate(instructorId, date);

        return lessons.stream().map(LessonResponse::from).toList();
    }

    public LessonResponse getLesson(Long instructorId, Long lessonId) {
        Lesson lesson = lessonRepository.findByLessonIdAndInstructorId(lessonId, instructorId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        return LessonResponse.from(lesson);
    }

    public List<LessonTrendResponse> getDailyTrend(Long instructorId) {
        List<LessonTrendResponse> trend = new ArrayList<>();
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");

        for( int ago = 6; ago >= 0; ago--) {
            LocalDateTime threshold = now.atTime(23, 59, 59).minusDays(ago);
            long count = lessonRepository.countByInstructorIdAndStatusNotAndCreatedAtLessThanEqual(instructorId, LessonStatus.cancelled, threshold);

            trend.add(new LessonTrendResponse(threshold.format(formatter), count));
        }
        return trend;
    }

    public List<LessonTrendResponse> getMonthlyTrend(Long instructorId) {
        List<LessonTrendResponse> trend = new ArrayList<>();
        YearMonth now = YearMonth.now();

        for( int ago = 6; ago >= 0; ago--) {
            YearMonth targetMonth = now.minusMonths(ago);
            LocalDateTime threshold = targetMonth.atEndOfMonth().atTime(23,59,59);

            long count = lessonRepository.countByInstructorIdAndStatusNotAndCreatedAtLessThanEqual(instructorId, LessonStatus.cancelled, threshold);

            trend.add(new LessonTrendResponse(targetMonth.toString(), count));
        }
        return trend;
    }

    public Long create(Long instructorId, CreateLessonRequest request) {
        Lesson lesson = Lesson.create(instructorId, request);
        return lessonRepository.save(lesson).getLessonId();
    }

    @Transactional
    public void update(Long instructorId, Long lessonId, UpdateLessonRequest request) {
        Lesson lesson = lessonRepository.findByLessonIdAndInstructorId(lessonId, instructorId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
        lesson.update(request);
    }

    public List<EnrollmentResponse> getEnrollments(Long instructorId, Long lessonId) {
        Lesson lesson = lessonRepository.findByLessonIdAndInstructorId(lessonId, instructorId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        return enrollmentRepository.findByLessonIdOrderByRequestedAtAsc(lessonId).stream()
                .map(e -> studentRepository.findById(e.getStudentId())
                        .map(s -> EnrollmentResponse.of(e, s, lesson))
                        .orElse(null))
                .filter(e -> e != null)
                .toList();
    }
}
