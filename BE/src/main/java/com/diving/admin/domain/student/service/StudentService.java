package com.diving.admin.domain.student.service;

import com.diving.admin.domain.student.dto.StudentResponse;
import com.diving.admin.domain.student.dto.StudentTrendResponse;
import com.diving.admin.domain.student.entity.Student;
import com.diving.admin.domain.student.repository.StudentRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<StudentResponse> getList(Long instructorId) {
        return studentRepository.findByInstructorIdOrderByNameAsc(instructorId)
            .stream().map(StudentResponse::from).toList();
    }

    public List<StudentTrendResponse> getDailyTrend(Long instructorId) {
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");
        List<StudentTrendResponse> trend = new ArrayList<>();

        for( int ago = 6; ago >= 0; ago--) {
            LocalDateTime threshold = now.atTime(23,59,59).minusDays(ago);
            long count = studentRepository.countByInstructorIdAndIsDeletedAndCreatedAtLessThanEqual(
                    instructorId, false, threshold);
            trend.add(new StudentTrendResponse(threshold.format(formatter), count));
        }

        return trend;
    }

    public List<StudentTrendResponse> getMonthlyTrend(Long instructorId) {
        YearMonth now = YearMonth.now();
        List<StudentTrendResponse> trend = new ArrayList<>();

        for( int ago = 6; ago >= 0; ago--) {
            YearMonth targetMonth = now.minusMonths(ago);
            LocalDateTime threshold = targetMonth.atEndOfMonth().atTime(23, 59, 59);

            long count = studentRepository.countByInstructorIdAndIsDeletedAndCreatedAtLessThanEqual(
                    instructorId, false, threshold);
            trend.add(new StudentTrendResponse(targetMonth.toString(), count));
        }

        return trend;
    }

    @Transactional
    public void update(Long instructorId, Long studentId, String content) {
        Student student = studentRepository.findByStudentIdAndInstructorId(studentId, instructorId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        student.update(content);
    }
}
