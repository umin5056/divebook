package com.diving.admin.domain.lesson.controller;

import com.diving.admin.domain.lesson.dto.CreateLessonRequest;
import com.diving.admin.domain.lesson.dto.LessonResponse;
import com.diving.admin.domain.lesson.dto.UpdateLessonRequest;
import com.diving.admin.domain.lesson.service.LessonService;

import com.diving.admin.domain.enrollment.dto.EnrollmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    public ResponseEntity<List<LessonResponse>> getList(
            @AuthenticationPrincipal Long instructorId
    ) {
        return ResponseEntity.ok(lessonService.getList(instructorId));
    }

    @PostMapping
    public ResponseEntity<Void> create(
            @AuthenticationPrincipal Long instructorId,
            @RequestBody CreateLessonRequest request
    ) {
        Long lessonId = lessonService.create(instructorId, request);
        return ResponseEntity.created(URI.create("/api/lessons/" + lessonId)).build();
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<Void> update(
            @PathVariable Long lessonId,
            @RequestBody UpdateLessonRequest request
    ) {
        lessonService.update(lessonId, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{lessonId}/enrollments")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollments(
            @PathVariable Long lessonId
    ) {
        return ResponseEntity.ok(lessonService.getEnrollments(lessonId));
    }
}
