import { useEffect, useState } from "react";
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

import LessonFormFields from "../../components/lesson/LessonFormFields";
import StudentCard from "../../components/student/StudentCard";
import StudentDetailSheet from "../../components/student/StudentDetailSheet";

import { updatePaymentStatus, updateLessonRequest } from "../../api/lesson";
import { useLessonById } from "../../hooks/useLessonById";
import { useLessonEnrollments } from "../../hooks/useLessonEnrollments";
import { useUpdateLesson } from "../../hooks/useUpdateLesson";
import { showToast } from "../../store/useToastStore";

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

export default function LessonDetailPage() {
  const navigate = useNavigate();
  const [confirmOpened, setConfirmOpened] = useState(false);
  const { lessonId } = useParams();
  const { data: lesson, isPending: lessonPending } = useLessonById(lessonId);
  const location = useLocation();

  const initialTab =
    location.state?.activeTab === "students" ? "students" : "lesson";

  const onClose = () => navigate(-1);

  useEffect(() => {
    if (lessonPending) return;

    if (!lesson) {
      alert("수업 정보가 존재하지 않습니다.");
      navigate("/lessons");
    }
  }, [lessonPending, lesson, navigate]);

  if (!lesson) {
    return null;
  }

  return (
    <div className="max-w-145 h-full mx-auto">
      <LessonDetailContent
        key={lesson.lessonId}
        lesson={lesson}
        initialTab={initialTab}
        onClose={onClose}
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

function buildForm(lesson) {
  return {
    ...lesson,
    startTime: lesson.startTime.slice(-5),
    endTime: lesson.endTime.slice(-5),
    fee: lesson.fee.toLocaleString(),
  };
}

function LessonDetailContent({ lesson, initialTab, onClose, onConfirmClose }) {
  const updateLesson = useUpdateLesson();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState(() => buildForm(lesson));
  const [originForm, setOriginForm] = useState(form);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { data: enrollments = [] } = useLessonEnrollments(form.lessonId);

  const selectedStudent = enrollments.find(
    (e) => e.studentId === selectedStudentId,
  );

  const paidCount = enrollments.filter(
    (e) => e.paymentStatus === "paid",
  ).length;
  const parsedMaxStudents = Number(String(form.maxStudents).replace(/,/g, ""));

  const handleClose = () => {
    const isEdited = JSON.stringify(form) !== JSON.stringify(originForm);
    if (isEdited) {
      onConfirmClose();
    } else {
      onClose();
    }
  };

  const handlePaymentStatus = async (enrollmentId, current, next) => {
    if (current === next) return;

    if (next === "paid" && paidCount >= form.maxStudents) {
      showToast(`최대 인원(${form.maxStudents}명)이 이미 찼습니다.`);
      return;
    }

    try {
      await updatePaymentStatus(enrollmentId, next);
      queryClient.invalidateQueries({
        queryKey: ["lessons", form.lessonId, "enrollments"],
      });

      const newPaidCount =
        paidCount + (next === "paid" ? 1 : 0) - (current === "paid" ? 1 : 0);

      if (
        next === "paid" &&
        newPaidCount >= parsedMaxStudents &&
        form.status !== "cancelled"
      ) {
        await updateLesson.mutateAsync({
          lessonId: form.lessonId,
          data: updateLessonRequest(form, "closed"),
        });
        setForm((p) => ({ ...p, status: "closed" }));
        setOriginForm({ ...form, status: "closed" });
        showToast("최대 인원이 찼습니다. 강습 상태가 마감으로 변경되었습니다.");
      } else if (
        current === "paid" &&
        newPaidCount < parsedMaxStudents &&
        form.status === "closed"
      ) {
        await updateLesson.mutateAsync({
          lessonId: form.lessonId,
          data: updateLessonRequest(form, "open"),
        });
        setForm((p) => ({ ...p, status: "open" }));
        setOriginForm({ ...form, status: "open" });
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
        lessonId: form.lessonId,
        data: {
          ...form,
          maxStudents: parsedMaxStudents,
          fee: Number(String(form.fee).replace(/,/g, "")),
          status: finalStatus,
        },
      });
      setOriginForm(form);
      showToast("저장되었습니다.");
    } catch {
      showToast("강습 정보 저장에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Toolbar top className="ios:pt-4">
        <ToolbarPane>
          <Link iconOnly onClick={handleClose}>
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
          <div className="px-8">
            <LessonFormFields
              form={form}
              setForm={setForm}
              isFull={paidCount >= parsedMaxStudents}
            />
          </div>
        )}

        {tab === "students" && (
          <div className="px-4 py-2">
            {enrollments.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                수강생이 없습니다.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {enrollments.map((e) => (
                  <StudentCard
                    key={e.studentId}
                    student={e}
                    onClick={() => setSelectedStudentId(e.studentId)}
                  >
                    <div className="w-full bg-gray-300 h-px my-3"></div>
                    <div className="flex justify-between gap-1">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          className={`flex-1 rounded-full border px-3 py-1 text-base font-bold ${e.paymentStatus === opt.value ? opt.activeClass : opt.inactiveClass}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handlePaymentStatus(
                              e.enrollmentId,
                              e.paymentStatus,
                              opt.value,
                            );
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </StudentCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {tab === "lesson" && (
        <div className="w-full p-5">
          <Button large rounded onClick={handleSubmit}>
            저장
          </Button>
        </div>
      )}

      <StudentDetailSheet
        student={selectedStudent}
        onClose={() => setSelectedStudentId(null)}
      />
    </div>
  );
}
