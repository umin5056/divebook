package com.diving.admin.domain.lesson.entity;

import com.diving.admin.domain.lesson.dto.CreateLessonRequest;
import com.diving.admin.domain.lesson.dto.UpdateLessonRequest;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "tbl_lesson")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonId;

    @Column(nullable = false)
    private Long instructorId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false)
    private LocalDate lessonDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Short maxStudents;

    @Column(nullable = false)
    private Integer fee;

    @Column(columnDefinition = "text")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LessonStatus status;

    @Formula("(SELECT COUNT(*) FROM tbl_enrollment e WHERE e.lesson_id = lesson_id AND e.payment_status = 'paid')")
    private int enrollmentCount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    public void update(UpdateLessonRequest req) {
        this.title = req.title();
        this.location = req.location();
        this.lessonDate = req.lessonDate();
        this.startTime = req.startTime();
        this.endTime = req.endTime();
        this.maxStudents = req.maxStudents();
        this.fee = req.fee();
        this.content = req.content();
        this.status = req.status();
        this.modifiedAt = LocalDateTime.now();
    }

    public static Lesson create(Long instructorId, CreateLessonRequest req) {
        Lesson lesson = new Lesson();
        lesson.instructorId = instructorId;
        lesson.title = req.title();
        lesson.location = req.location();
        lesson.lessonDate = req.lessonDate();
        lesson.startTime = req.startTime();
        lesson.endTime = req.endTime();
        lesson.maxStudents = req.maxStudents();
        lesson.fee = req.fee();
        lesson.content = req.content();
        lesson.status = req.status();
        lesson.createdAt = LocalDateTime.now();
        lesson.modifiedAt = LocalDateTime.now();
        return lesson;
    }
}
