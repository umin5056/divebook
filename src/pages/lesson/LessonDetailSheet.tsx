import { useEffect, useMemo, useRef, useState } from "react";
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
import LessonFormFields, {
  type LessonFormState,
} from "../../components/LessonFormFields";
import {
  updatePaymentStatus,
  lessonToUpdateRequest,
  type LessonResponse,
  type EnrollmentResponse,
} from "../../api/lesson";
import { useLessonEnrollments } from "../../hooks/useLessonEnrollments";
import { useUpdateLesson } from "../../hooks/useUpdateLesson";

interface LessonDetailSheetProps {
  lesson: LessonResponse | null;
  onClose: () => void;
}

const PAYMENT_OPTIONS: {
  value: "pending" | "paid" | "refunded";
  label: string;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    value: "paid",
    label: "납부",
    activeClass: "bg-blue-500 text-white border-blue-500",
    inactiveClass: "border-blue-500 text-gray-900",
  },
  {
    value: "pending",
    label: "미납",
    activeClass: "bg-yellow-400 text-white border-yellow-400",
    inactiveClass: "border-yellow-400 text-gray-900",
  },
  {
    value: "refunded",
    label: "환불",
    activeClass: "bg-gray-400 text-white border-gray-400",
    inactiveClass: "border-gray-400 text-gray-900",
  },
];

function buildForm(lesson: LessonResponse): LessonFormState {
  return {
    title: lesson.title,
    location: lesson.location,
    lessonDate: lesson.lessonDate,
    startTime: lesson.startTime.slice(-5),
    endTime: lesson.endTime.slice(-5),
    fee: lesson.fee.toLocaleString(),
    maxStudents: lesson.maxStudents,
    content: lesson.content ?? "",
    status: lesson.status,
  };
}

interface LessonDetailContentProps {
  lesson: LessonResponse;
  onClose: () => void;
  onConfirmClose: () => void;
  onTabChange: (tab: "info" | "enrollments") => void;
}

function LessonDetailContent({
  lesson,
  onClose,
  onConfirmClose,
  onTabChange,
}: LessonDetailContentProps) {
  const updateLesson = useUpdateLesson();
  const [tab, setTab] = useState<"info" | "enrollments">("info");
  const [form, setForm] = useState<LessonFormState>(() => buildForm(lesson));
  const [toast, setToast] = useState("");

  const refs = {
    title: useRef<HTMLInputElement>(null),
    location: useRef<HTMLInputElement>(null),
    fee: useRef<HTMLInputElement>(null),
    maxStudents: useRef<HTMLInputElement>(null),
    content: useRef<HTMLTextAreaElement>(null),
  };

  const { data: fetchedEnrollments } = useLessonEnrollments(lesson.lessonId);
  const [localEnrollments, setLocalEnrollments] = useState<
    EnrollmentResponse[]
  >([]);
  const enrollmentsInitialized = useRef(false);

  useEffect(() => {
    onTabChange("info");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync TanStack Query data to local state once on initial load.
  // Not re-sorted on subsequent mutations — intentional UX decision.
  useEffect(() => {
    if (fetchedEnrollments && !enrollmentsInitialized.current) {
      enrollmentsInitialized.current = true;
      setLocalEnrollments(
        [...fetchedEnrollments].sort((a, b) => {
          const order = { paid: 0, pending: 1, refunded: 2 };
          return order[a.paymentStatus] - order[b.paymentStatus];
        }),
      );
    }
  }, [fetchedEnrollments]);

  const paidCount = useMemo(
    () => localEnrollments.filter((e) => e.paymentStatus === "paid").length,
    [localEnrollments],
  );
  const parsedMaxStudents = useMemo(
    () => Number(String(form.maxStudents).replace(/,/g, "")),
    [form.maxStudents],
  );
  const isFull = paidCount >= parsedMaxStudents;

  const handleTabChange = (t: "info" | "enrollments") => {
    setTab(t);
    onTabChange(t);
  };

  const handleClose = () => (tab === "info" ? onConfirmClose() : onClose());

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const handlePaymentStatus = async (
    enrollmentId: string,
    current: EnrollmentResponse["paymentStatus"],
    next: EnrollmentResponse["paymentStatus"],
  ) => {
    if (current === next) return;

    if (next === "paid" && paidCount >= lesson.maxStudents) {
      showToast(`최대 인원(${lesson.maxStudents}명)이 이미 찼습니다.`);
      return;
    }

    await updatePaymentStatus(enrollmentId, next);

    const updatedEnrollments = localEnrollments.map((e) =>
      e.enrollmentId === enrollmentId ? { ...e, paymentStatus: next } : e,
    );
    setLocalEnrollments(updatedEnrollments);

    const newPaidCount = updatedEnrollments.filter(
      (e) => e.paymentStatus === "paid",
    ).length;

    if (
      next === "paid" &&
      newPaidCount >= parsedMaxStudents &&
      form.status !== "cancelled"
    ) {
      await updateLesson.mutateAsync({
        lessonId: lesson.lessonId,
        data: lessonToUpdateRequest(lesson, "closed"),
      });
      setForm((p) => ({ ...p, status: "closed" }));
      showToast("최대 인원이 찼습니다. 강습 상태가 마감으로 변경되었습니다.");
    } else if (
      current === "paid" &&
      newPaidCount < parsedMaxStudents &&
      form.status === "closed"
    ) {
      await updateLesson.mutateAsync({
        lessonId: lesson.lessonId,
        data: lessonToUpdateRequest(lesson, "open"),
      });
      setForm((p) => ({ ...p, status: "open" }));
      showToast("강습 상태가 진행으로 변경되었습니다.");
    }
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
    if (parsedMaxStudents < paidCount) {
      showToast(`납부 인원(${paidCount}명)보다 적게 설정할 수 없습니다.`);
      return;
    }

    const finalStatus =
      parsedMaxStudents === paidCount && form.status !== "cancelled"
        ? "closed"
        : form.status;
    await updateLesson.mutateAsync({
      lessonId: lesson.lessonId,
      data: {
        ...form,
        maxStudents: parsedMaxStudents,
        fee: Number(String(form.fee).replace(/,/g, "")),
        status: finalStatus,
      },
    });
    onClose();
  };

  return (
    <>
      <div className="flex flex-col h-[95svh]">
        <Toolbar top className="justify-end ios:pt-4 max-w-145 mx-auto z-10">
          <ToolbarPane />
          <ToolbarPane>
            <Link iconOnly onClick={handleClose}>
              <X />
            </Link>
          </ToolbarPane>
        </Toolbar>

        <div className="flex border-b border-gray-100 mx-8">
          {(["info", "enrollments"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-400"
              }`}
            >
              {t === "info" ? "수업 정보" : `수강생 ${paidCount}명`}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          {tab === "info" && (
            <div className="px-8 mb-8">
              <LessonFormFields
                form={form}
                setForm={setForm}
                refs={refs}
                showToast={showToast}
                isFull={isFull}
              />
            </div>
          )}

          {tab === "enrollments" && (
            <div className="px-4 py-2">
              {localEnrollments.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  수강생이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {localEnrollments.map((e) => (
                    <div
                      key={e.enrollmentId}
                      className="flex items-center justify-between py-4 px-2"
                    >
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {e.name}
                        </div>
                        <div className="text-sm text-gray-500">{e.phone}</div>
                      </div>
                      <div className="flex gap-1">
                        {PAYMENT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            className={`rounded-full border px-3 py-1 text-sm font-medium ${e.paymentStatus === opt.value ? opt.activeClass : opt.inactiveClass}`}
                            onClick={() =>
                              handlePaymentStatus(
                                e.enrollmentId,
                                e.paymentStatus,
                                opt.value,
                              )
                            }
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {tab === "info" && (
          <div className="px-10">
            <Button large rounded onClick={handleSubmit}>
              저장
            </Button>
          </div>
        )}
      </div>

      <Toast opened={!!toast} position="center">
        <div className="shrink">{toast}</div>
      </Toast>
    </>
  );
}

export default function LessonDetailSheet({
  lesson,
  onClose,
}: LessonDetailSheetProps) {
  const [confirmOpened, setConfirmOpened] = useState(false);
  const tabRef = useRef<"info" | "enrollments">("info");

  return (
    <Sheet
      className="max-w-145 mx-auto pb-5"
      opened={!!lesson}
      onBackdropClick={() =>
        tabRef.current === "info" ? setConfirmOpened(true) : onClose()
      }
    >
      {lesson && (
        <LessonDetailContent
          key={lesson.lessonId}
          lesson={lesson}
          onClose={onClose}
          onConfirmClose={() => setConfirmOpened(true)}
          onTabChange={(t) => {
            tabRef.current = t;
          }}
        />
      )}

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
