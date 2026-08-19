import { useRef, useState } from "react";
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
import { X } from "lucide-react";
import LessonFormFields from "./LessonFormFields";
import { useCreateLesson } from "../../hooks/useCreateLesson";

function getDefaults() {
  const now = new Date();
  const end = new Date(now.getTime() + 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    startTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
  };
}

export default function LessonAddSheet({ opened, onClose }) {
  const createLesson = useCreateLesson();
  const refs = {
    title: useRef(null),
    location: useRef(null),
    fee: useRef(null),
    maxStudents: useRef(null),
    content: useRef(null),
  };

  const [toast, setToast] = useState("");
  const [confirmOpened, setConfirmOpened] = useState(false);

  const defaults = getDefaults();
  const [form, setForm] = useState({
    title: "",
    location: "",
    lessonDate: defaults.date,
    startTime: defaults.startTime,
    endTime: defaults.endTime,
    fee: 0,
    maxStudents: 1,
    content: "",
    status: "open",
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const reset = () => {
    setForm({
      title: "",
      location: "",
      lessonDate: defaults.date,
      startTime: defaults.startTime,
      endTime: defaults.endTime,
      fee: 0,
      maxStudents: 0,
      content: "",
      status: "open",
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.title) { showToast("제목을 입력하세요."); return; }
    if (!form.location) { showToast("장소를 입력하세요."); return; }
    if (form.startTime > form.endTime) { showToast("종료 시간이 시작 시간보다 이릅니다."); return; }

    await createLesson.mutateAsync({
      ...form,
      maxStudents: Number(String(form.maxStudents).replace(/,/g, "")),
      fee: Number(String(form.fee).replace(/,/g, "")),
    });
    handleClose();
  };

  return (
    <Sheet
      className="max-w-145 mx-auto pb-5"
      opened={opened}
      onBackdropClick={() => setConfirmOpened(true)}
    >
      <div className="flex flex-col max-h-[95svh]">
        <Toolbar top className="justify-end ios:pt-4 max-w-145 mx-auto z-10">
          <ToolbarPane />
          <ToolbarPane>
            <Link iconOnly onClick={() => setConfirmOpened(true)}>
              <X />
            </Link>
          </ToolbarPane>
        </Toolbar>

        <div className="flex-1 min-h-0 mb-8 px-8 overflow-auto">
          <LessonFormFields
            form={form}
            setForm={setForm}
            refs={refs}
            showToast={showToast}
          />
        </div>
      </div>

      <div className="px-10">
        <Button large rounded onClick={handleSubmit}>
          추가
        </Button>
      </div>

      <Toast opened={!!toast} position="center">
        <div className="shrink">{toast}</div>
      </Toast>

      <Dialog
        opened={confirmOpened}
        title="닫기"
        content="입력하신 정보가 모두 사라집니다."
        buttons={
          <>
            <DialogButton onClick={() => setConfirmOpened(false)}>
              취소
            </DialogButton>
            <DialogButton
              onClick={() => {
                setConfirmOpened(false);
                handleClose();
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
