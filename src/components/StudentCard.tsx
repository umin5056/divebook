import { Card } from "konsta/react";
import { Phone, Mail } from "lucide-react";
import type { StudentResponse } from "../api/student";

interface StudentCardProps {
  student: StudentResponse;
  onPress?: (student: StudentResponse) => void;
}

export default function StudentCard({ student, onPress }: StudentCardProps) {
  return (
    <Card onClick={() => onPress?.(student)}>
      <div className="text-xl font-bold text-gray-900">{student.name}</div>
      <div className="mt-2 flex items-center gap-1 font-bold text-sm text-gray-500">
        <Phone size={14} />
        <span>{student.phone}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 font-bold text-sm text-gray-500">
        <Mail size={14} />
        <span>{student.email}</span>
      </div>
    </Card>
  );
}
