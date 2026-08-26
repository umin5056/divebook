package com.diving.admin.domain.student.controller;

import com.diving.admin.domain.student.dto.StudentResponse;
import com.diving.admin.domain.student.dto.StudentTrendResponse;
import com.diving.admin.domain.student.dto.UpdateStudentContentRequest;
import com.diving.admin.domain.student.service.StudentService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getList(
        @AuthenticationPrincipal Long instructorId
    ) {
        return ResponseEntity.ok(studentService.getList(instructorId));
    }

    @GetMapping("/dailyTrend")
    public ResponseEntity<List<StudentTrendResponse>> getDailyTrend(
        @AuthenticationPrincipal Long instructorId
    ) {
        return ResponseEntity.ok(studentService.getDailyTrend(instructorId));
    }

    @GetMapping("/monthlyTrend")
    public ResponseEntity<List<StudentTrendResponse>> getMonthlyTrend(
        @AuthenticationPrincipal Long instructorId
    ) {
        return ResponseEntity.ok(studentService.getMonthlyTrend(instructorId));
    }
    
    @PatchMapping("/{studentId}")
    public ResponseEntity<Void> update(
        @AuthenticationPrincipal Long instructorId,
        @PathVariable Long studentId,
        @RequestBody UpdateStudentContentRequest request
    ) {
        studentService.update(instructorId, studentId, request.content());
        return ResponseEntity.noContent().build();
    }
}
