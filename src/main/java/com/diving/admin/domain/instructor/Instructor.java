package com.diving.admin.domain.instructor;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_instructor")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Instructor {

    @Id
    @UuidGenerator
    @Column(name = "instructor_id", length = 36)
    private String instructorId;

    @Column(name = "crew_id", length = 36)
    private String crewId;

    @Column(name = "kakao_id", nullable = false, unique = true, length = 100)
    private String kakaoId;

    @Column(length = 255)
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

    public static Instructor create(String kakaoId, String name, String profileImageUrl) {
        Instructor instructor = new Instructor();
        instructor.kakaoId = kakaoId;
        instructor.name = name;
        instructor.profileImageUrl = profileImageUrl;
        instructor.createdAt = LocalDateTime.now();
        instructor.modifiedAt = LocalDateTime.now();
        return instructor;
    }
}
