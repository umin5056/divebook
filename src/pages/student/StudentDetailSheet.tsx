import {
  Link,
  Sheet,
  Toolbar,
  ToolbarPane,
  Button,
  Toast,
  Dialog,
  DialogButton,
} from "konsta/react";
import { useState } from "react";
import type { StudentResponse } from "../../api/student";

interface StudentDetailSheetProps {
  student: StudentResponse | null;
  onClose: () => void;
}

interface StudentDetailContenProps {
  student: StudentResponse;
}

function StudentDetailContent({ student }) {
  return <></>;
}

export default function StudentDetailSheet({
  student,
  onClose,
}: StudentDetailSheetProps) {
  const [confirmOpened, setConfirmOpened] = useState(false);

  return (
    <Sheet
      className="max-w-145 mx-auto pb-5"
      opened={!!student}
      onBackdropClick={onClose}
    >
      {student && <StudentDetailContent student={student} />}
      <Dialog
        opened={confirmOpened}
        title="닫기"
        content="변경사항이 저장되지 않습니다."
        buttons={
          <>
            <DialogButton onClick={() => setConfirmOpened(false)}>
              취소
            </DialogButton>
            <DialogButton
              onClick={() => {
                setConfirmOpened(false);
                onClose();
              }}
            >
              확인
            </DialogButton>
          </>
        }
      />
    </Sheet>
  );
}
