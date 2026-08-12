import { Searchbar } from "konsta/react";
import { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import StudentCard from "../../components/StudentCard";
import StudentDetailSheet from "./StudentDetailSheet";

export default function StudentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { data: students } = useStudents();

  const filteredStudents = students?.filter((student) =>
    student.name.includes(searchQuery),
  );

  return (
    <>
      <div className="mx-4">
        <Searchbar
          onInput={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {filteredStudents?.map((student) => (
        <StudentCard
          key={student.studentId}
          student={student}
          onPress={setSelectedStudent}
        />
      ))}

      <StudentDetailSheet
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </>
  );
}
