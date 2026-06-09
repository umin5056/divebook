package com.diving.admin.domain.student;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_student")
@Getter
public class Student {

    @Id
    @UuidGenerator
    @Column(name = "student_id", length = 36)
    private String studentId;

    @Column(name = "crew_id", nullable = false, length = 36)
    private String crewId;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;
}
