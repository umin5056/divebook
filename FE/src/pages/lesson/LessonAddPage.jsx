import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link,
  Toolbar,
  ToolbarPane,
  Button,
  Dialog,
  DialogButton,
} from "konsta/react";
import { FaArrowLeft } from "react-icons/fa";
import LessonFormFields from "../../components/lesson/LessonFormFields";
import { useCreateLesson } from "../../hooks/useCreateLesson";
import { showToast } from "../../store/useToastStore";

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

export default function LessonAddPage() {
  const navigate = useNavigate();
  const createLesson = useCreateLesson();
  const refs = {
    title: useRef(null),
    location: useRef(null),
    fee: useRef(null),
    maxStudents: useRef(null),
    content: useRef(null),
  };

  const [confirmOpened, setConfirmOpened] = useState(false);

  const [form, setForm] = useState(() => {
    const defaults = getDefaults();
    return {
      title: "",
      location: "",
      lessonDate: defaults.date,
      startTime: defaults.startTime,
      endTime: defaults.endTime,
      fee: 0,
      maxStudents: 1,
      content: "",
      status: "open",
    };
  });

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!form.title) {
      showToast("제목을 입력하세요.");
      return;
    }
    if (!form.location) {
      showToast("장소를 입력하세요.");
      return;
    }
    if (form.startTime > form.endTime) {
      showToast("종료 시간이 시작 시간보다 이릅니다.");
      return;
    }

    try {
      await createLesson.mutateAsync({
        ...form,
        maxStudents: Number(String(form.maxStudents).replace(/,/g, "")),
        fee: Number(String(form.fee).replace(/,/g, "")),
      });
      handleClose();
    } catch {
      showToast("강습 추가에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-145 mx-auto pb-5">
      <div className="flex flex-col h-[95dvh]">
        <Toolbar top className="justify-end ios:pt-4 max-w-145 mx-auto z-10">
          <ToolbarPane>
            <Link iconOnly onClick={() => setConfirmOpened(true)}>
              <FaArrowLeft />
            </Link>
          </ToolbarPane>
          <ToolbarPane />
        </Toolbar>

        <div className="flex-1 min-h-0 overflow-auto">
          <div className="px-8 mb-8">
            <LessonFormFields form={form} setForm={setForm} refs={refs} />
          </div>
        </div>

        <div className="px-10">
          <Button large rounded onClick={handleSubmit}>
            추가
          </Button>
        </div>
      </div>

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
    </div>
  );
}
