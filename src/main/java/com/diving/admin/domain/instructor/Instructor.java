package com.diving.admin.domain.instructor;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_instructor")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    public static Instructor create(String email, String name, String profileImageUrl) {
        Instructor instructor = new Instructor();
        instructor.email = email;
        instructor.name = name;
        instructor.profileImageUrl = profileImageUrl;
        instructor.createdAt = LocalDateTime.now();
        instructor.modifiedAt = LocalDateTime.now();
        return instructor;
    }
}
