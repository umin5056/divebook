import { useState } from "react";
import { Sheet, Toolbar, ToolbarPane, Button } from "konsta/react";
import { X } from "lucide-react";
import { FaSquarePhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { BsChatLeftTextFill } from "react-icons/bs";
import { ClearableTextarea } from "../ClearableInput";
import { useUpdateStudent } from "../../hooks/useUpdateStudent";
import { showToast } from "../../store/useToastStore";

export default function StudentDetailSheet({ student, onClose }) {
  return (
    <Sheet
      className="py-5"
      opened={!!student}
      onBackdropClick={onClose}
    >
      {student && (
        <StudentDetailContent
          key={student.studentId}
          student={student}
          onClose={onClose}
        />
      )}
    </Sheet>
  );
}

function StudentDetailContent({ student, onClose }) {
  const updateStudent = useUpdateStudent();
  const [content, setContent] = useState(student.content ?? "");

  const handleUpdateContent = () => {
    updateStudent.mutate({
      studentId: student.studentId,
      content: content,
    });

    showToast("저장되었습니다.");
  };

  return (
    <>
      <Toolbar top className="justify-center">
        <div className="flex items-center min-w-0 text-3xl font-bold text-gray-900 wrap-break-words">
          {student.name}
        </div>
        <ToolbarPane className="p-3">
          <X onClick={onClose} />
        </ToolbarPane>
      </Toolbar>
      <div className="px-4">
        <div className="flex gap-2 text-base text-gray-500">
          <FaSquarePhone className="mt-1 shrink-0" />
          <span className="min-w-0 wrap-break-words">{student.phone}</span>
        </div>
        <div className="flex gap-2 text-base text-gray-500">
          <IoIosMail className="mt-1 shrink-0" />
          <span className="min-w-0 wrap-break-words">{student.email}</span>
        </div>
        <div className="flex gap-2 text-base text-gray-500 pt-3">
          <BsChatLeftTextFill className="mt-1 shrink-0" />
          <ClearableTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClear={() => setContent("")}
            className="border border-gray-400 rounded-xl p-3 pr-10 text-xl text-gray-900 resize-none"
            rows={10}
            placeholder="입력하세요."
          />
        </div>
      </div>
      <div className="w-ful p-5">
        <Button large rounded onClick={handleUpdateContent}>
          저장
        </Button>
      </div>
    </>
  );
}
