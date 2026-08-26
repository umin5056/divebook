package com.diving.admin.domain.student.dto;

import com.diving.admin.domain.student.entity.Student;

public record StudentResponse (
  Long studentId,
  Long instructorId,
  String phone,
  String name,
  String email,
  String content,
  Boolean isDeleted
) {
  public static StudentResponse from(Student student) {
    return new StudentResponse(
      student.getStudentId(),
      student.getInstructorId(),
      student.getPhone(),
      student.getName(),
      student.getEmail(),
      student.getContent(),
      student.getIsDeleted()
    );
  }
}
