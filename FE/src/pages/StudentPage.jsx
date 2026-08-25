import { useState } from "react";
import { Searchbar } from "konsta/react";
import StudentCard from "../components/student/StudentCard";
import StudentDetailSheet from "../components/student/StudentDetailSheet";
import { useStudents } from "../hooks/useStudents";

export default function StudentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { data: students = [] } = useStudents();

  const selectedStudent = students.find(
    (e) => e.studentId === selectedStudentId,
  );

  const filteredStudents = students?.filter((student) =>
    student.name.includes(searchQuery),
  );

  return (
    <>
      <div className="m-4">
        <Searchbar
          onInput={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4">
        {filteredStudents?.map((e) => (
          <StudentCard
            key={e.studentId}
            student={e}
            onClick={() => setSelectedStudentId(e.studentId)}
          />
        ))}
      </div>

      <StudentDetailSheet
        student={selectedStudent}
        onClose={() => setSelectedStudentId(null)}
      />
    </>
  );
}
