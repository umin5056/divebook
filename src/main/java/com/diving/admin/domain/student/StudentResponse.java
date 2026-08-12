package com.diving.admin.domain.student;

public record StudentResponse (
  String studentId,
  String instructorId,
  String phone,
  String name,
  String email,
  String content,
  String deleted
) {
  public static StudentResponse from(Student student) {
    return new StudentResponse(
      student.getStudentId(),
      student.getInstructorId(),
      student.getPhone(),
      student.getName(),
      student.getEmail(),
      student.getContent(),
      student.getDeleted()
    );
  }
}
