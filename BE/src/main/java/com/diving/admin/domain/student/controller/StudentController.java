package com.diving.admin.domain.student.controller;

import com.diving.admin.domain.student.dto.StudentResponse;
import com.diving.admin.domain.student.service.StudentService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

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
}
