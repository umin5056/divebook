import { type RefObject } from "react";
import FormRow from "./FormRow";
import { ClearableInput, ClearableTextarea } from "./ClearableInput";

export type LessonFormState = {
  title: string;
  location: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  fee: number | string;
  maxStudents: number | string;
  content: string;
  status: "open" | "closed" | "cancelled";
};

type LessonFormRefs = {
  title: RefObject<HTMLInputElement | null>;
  location: RefObject<HTMLInputElement | null>;
  fee: RefObject<HTMLInputElement | null>;
  maxStudents: RefObject<HTMLInputElement | null>;
  content: RefObject<HTMLTextAreaElement | null>;
};

const STATUS_OPTIONS = [
  {
    value: "open",
    label: "진행",
    color: "text-white border-blue-500 bg-blue-500",
  },
  {
    value: "closed",
    label: "마감",
    color: "text-white border-red-500 bg-red-500",
  },
  {
    value: "cancelled",
    label: "취소",
    color: "text-white border-gray-400 bg-gray-500",
  },
] as const;

interface LessonFormFieldsProps {
  form: LessonFormState;
  setForm: React.Dispatch<React.SetStateAction<LessonFormState>>;
  refs: LessonFormRefs;
  showToast: (message: string) => void;
  isFull?: boolean;
}

export default function LessonFormFields({
  form,
  setForm,
  refs,
  showToast,
  isFull = false,
}: LessonFormFieldsProps) {
  const { title: titleRef, location: locationRef, fee: feeRef, maxStudents: maxStudentsRef, content: contentRef } = refs;
  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isNumberField = ["fee", "maxStudents"].includes(field);
      const value = e.target.value;
      if (value !== "" && isNumberField) {
        setForm((prev) => ({
          ...prev,
          [field]: Number(value.replace(/,/g, "")).toLocaleString(),
        }));
      } else {
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    };

  return (
    <div className="divide-y divide-gray-100">
      <FormRow label="제목">
        <ClearableInput
          ref={titleRef}
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          onClear={() => setForm((p) => ({ ...p, title: "" }))}
          maxLength={100}
          enterKeyHint="next"
          onKeyDown={(e) => e.key === "Enter" && locationRef.current?.focus()}
          className="text-xl text-gray-900"
          placeholder="입력하세요."
        />
      </FormRow>

      <FormRow label="분류">
        <div className="grid grid-cols-3 gap-x-4">
          {STATUS_OPTIONS.map(({ value, label, color }) => {
            const blocked = value === "open" && isFull;
            return (
              <button
                key={value}
                onClick={() => {
                  if (blocked) {
                    showToast("인원이 마감되어 진행으로 변경할 수 없습니다.");
                    return;
                  }
                  setForm((p) => ({ ...p, status: value }));
                }}
                className={`border py-1 px-5 text-sm font-medium transition-colors ${form.status === value ? color : "text-gray-500 border-gray-500"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </FormRow>

      <FormRow label="장소">
        <ClearableInput
          ref={locationRef}
          type="text"
          value={form.location}
          onChange={handleChange("location")}
          onClear={() => setForm((p) => ({ ...p, location: "" }))}
          maxLength={100}
          enterKeyHint="done"
          className="text-xl text-gray-900"
          placeholder="입력하세요."
        />
      </FormRow>

      <FormRow label="날짜">
        <input
          type="date"
          value={form.lessonDate}
          onChange={handleChange("lessonDate")}
          className="flex-1 text-xl text-gray-900 outline-none"
        />
      </FormRow>

      <FormRow label="시작∙종료">
        <div className="flex flex-1 gap-3">
          <input
            type="time"
            value={form.startTime}
            onChange={handleChange("startTime")}
            className="flex-1 min-w-0 text-xl text-gray-900 outline-none"
          />
          <div className="w-px bg-gray-300" />
          <input
            type="time"
            value={form.endTime}
            onChange={handleChange("endTime")}
            className="flex-1 min-w-0 text-xl text-gray-900 outline-none"
          />
        </div>
      </FormRow>

      <FormRow label="요금">
        <ClearableInput
          ref={feeRef}
          type="text"
          value={form.fee}
          onChange={handleChange("fee")}
          onClear={() => setForm((p) => ({ ...p, fee: "" }))}
          onKeyDown={(e) =>
            e.key === "Enter" && maxStudentsRef.current?.focus()
          }
          maxLength={8}
          inputMode="numeric"
          enterKeyHint="done"
          className="text-xl text-gray-900 text-right"
        />
        <span className="ml-1 shrink-0 text-xl text-gray-900">원</span>
      </FormRow>

      <FormRow label="인원">
        <ClearableInput
          ref={maxStudentsRef}
          type="text"
          value={form.maxStudents}
          onChange={handleChange("maxStudents")}
          onClear={() => setForm((p) => ({ ...p, maxStudents: "" }))}
          maxLength={3}
          inputMode="numeric"
          enterKeyHint="done"
          className="text-xl text-gray-900 text-right"
        />
        <span className="ml-1 shrink-0 text-xl text-gray-900">명</span>
      </FormRow>

      <FormRow label="메모">
        <ClearableTextarea
          ref={contentRef}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          onClear={() => setForm((p) => ({ ...p, content: "" }))}
          className="text-xl text-gray-900 resize-none overflow-hidden"
          rows={1}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
          placeholder="입력하세요."
        />
      </FormRow>
    </div>
  );
}
