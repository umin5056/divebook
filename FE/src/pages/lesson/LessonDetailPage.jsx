import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Link,
  Toolbar,
  ToolbarPane,
  Button,
  Dialog,
  DialogButton,
} from "konsta/react";
import { FaArrowLeft } from "react-icons/fa";
import { FaSquarePhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { BsChatLeftTextFill } from "react-icons/bs";

import LessonFormFields from "../../components/lesson/LessonFormFields";
import { updatePaymentStatus, lessonToUpdateRequest } from "../../api/lesson";
import { useLessons } from "../../hooks/useLessons";
import { useLessonEnrollments } from "../../hooks/useLessonEnrollments";
import { useUpdateLesson } from "../../hooks/useUpdateLesson";
import { showToast } from "../../hooks/useToastStore";

const PAYMENT_OPTIONS = [
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

function buildForm(lesson) {
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

export default function LessonDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonId } = useParams();
  const { data: lessons = [] } = useLessons();
  const lesson = lessons.find((l) => String(l.lessonId) === lessonId);

  const initialTab =
    location.state?.activeTab === "students" ? "students" : "lesson";

  const [confirmOpened, setConfirmOpened] = useState(false);

  const onClose = () => navigate(-1);

  useEffect(() => {
    if (!lesson) {
      alert("수업 정보가 존재하지 않습니다.");
      navigate("/lessons");
    }
  }, [lesson, navigate]);

  if (!lesson) {
    return null;
  }

  return (
    <div className="max-w-145 mx-auto pb-5">
      <LessonDetailContent
        key={lesson.lessonId}
        lesson={lesson}
        initialTab={initialTab}
        onConfirmClose={() => setConfirmOpened(true)}
      />

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
    </div>
  );
}

function LessonDetailContent({ lesson, initialTab, onConfirmClose }) {
  const updateLesson = useUpdateLesson();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState(() => buildForm(lesson));

  const refs = {
    title: useRef(null),
    location: useRef(null),
    fee: useRef(null),
    maxStudents: useRef(null),
    content: useRef(null),
  };

  const { data: fetchedEnrollments } = useLessonEnrollments(lesson.lessonId);
  const [localEnrollments, setLocalEnrollments] = useState([]);
  const enrollmentsInitialized = useRef(false);

  const paidCount = localEnrollments.filter(
    (e) => e.paymentStatus === "paid",
  ).length;
  const parsedMaxStudents = Number(String(form.maxStudents).replace(/,/g, ""));
  const isFull = paidCount >= parsedMaxStudents;

  useEffect(() => {
    if (fetchedEnrollments && !enrollmentsInitialized.current) {
      enrollmentsInitialized.current = true;
      setLocalEnrollments(fetchedEnrollments);
    }
  }, [fetchedEnrollments]);

  const handlePaymentStatus = async (enrollmentId, current, next) => {
    if (current === next) return;

    if (next === "paid" && paidCount >= lesson.maxStudents) {
      showToast(`최대 인원(${lesson.maxStudents}명)이 이미 찼습니다.`);
      return;
    }

    try {
      await updatePaymentStatus(enrollmentId, next);
      queryClient.invalidateQueries({
        queryKey: ["lessons", lesson.lessonId, "enrollments"],
      });

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
        showToast("강습 상태가 모집으로 변경되었습니다.");
      }
    } catch {
      showToast("납부 상태 변경에 실패했습니다.");
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

    try {
      await updateLesson.mutateAsync({
        lessonId: lesson.lessonId,
        data: {
          ...form,
          maxStudents: parsedMaxStudents,
          fee: Number(String(form.fee).replace(/,/g, "")),
          status: finalStatus,
        },
      });
      showToast("저장되었습니다.");
    } catch {
      showToast("강습 정보 저장에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-[95svh]">
      <Toolbar top className="justify-end ios:pt-4 max-w-145 mx-auto z-10">
        <ToolbarPane>
          <Link iconOnly onClick={onConfirmClose}>
            <FaArrowLeft />
          </Link>
        </ToolbarPane>
        <ToolbarPane />
      </Toolbar>

      <div className="flex border-b border-gray-100 mx-8">
        {["lesson", "students"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400"
            }`}
          >
            {t === "lesson"
              ? "수업 정보"
              : `수강생 ${paidCount}/${parsedMaxStudents}명`}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {tab === "lesson" && (
          <div className="px-8 mb-8">
            <LessonFormFields
              form={form}
              setForm={setForm}
              refs={refs}
              isFull={isFull}
            />
          </div>
        )}

        {tab === "students" && (
          <div className="px-4 py-2">
            {localEnrollments.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                수강생이 없습니다.
              </div>
            ) : (
              localEnrollments.map((e) => (
                <div key={e.enrollmentId} className="py-4 px-2">
                  <div className="border bg-white border-gray-400  p-4 rounded-xl">
                    <div className="text-2xl font-semibold text-gray-900">
                      <span className="min-w-0 wrap-break-words">{e.name}</span>
                    </div>
                    <div className="flex gap-2 text-base text-gray-500">
                      <FaSquarePhone className="mt-1 shrink-0" />
                      <span className="min-w-0 wrap-break-words">
                        {e.phone}
                      </span>
                    </div>
                    <div className="flex gap-2 text-base text-gray-500">
                      <IoIosMail className="mt-1 shrink-0" />
                      <span className="min-w-0 wrap-break-words">
                        {e.email}
                      </span>
                    </div>
                    <div className="flex gap-2 text-base text-gray-500">
                      <BsChatLeftTextFill className="mt-1 shrink-0" />
                      <span className="min-w-0 wrap-break-words">
                        {e.content}
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 h-px my-3"></div>
                    <div className="flex justify-between gap-1">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          className={`flex-1 rounded-full border px-3 py-1 text-base font-bold ${e.paymentStatus === opt.value ? opt.activeClass : opt.inactiveClass}`}
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
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {tab === "lesson" && (
        <div className="px-10">
          <Button large rounded onClick={handleSubmit}>
            저장
          </Button>
        </div>
      )}
    </div>
  );
}
