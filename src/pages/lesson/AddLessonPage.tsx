import { useState } from "react";
import { Link, Sheet, Toolbar, ToolbarPane, Button } from "konsta/react";
import { X } from "lucide-react";
import FormRow from "../../components/FormRow";

interface AddLessonPageProps {
  opened: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  {
    value: "open",
    label: "진행중",
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
];

export default function AddLessonPage({ opened, onClose }: AddLessonPageProps) {
  const [status, setStatus] = useState<string>("open");
  const [form, setForm] = useState({
    title: "",
    location: "",
    lessonDate: "",
    startTime: "",
    endTime: "",
    fee: "0",
    maxStudents: "0",
    memo: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Sheet
      className="flex flex-col justify-between pb-safe-5 rounded-t-2xl max-w-145 h-[95%] mx-auto"
      opened={opened}
      onBackdropClick={onClose}
    >
      <div className="flex flex-col flex-1 min-h-0">
        <Toolbar top className="justify-end ios:pt-4 max-w-145 mx-auto z-10">
          <ToolbarPane />
          <ToolbarPane>
            <Link iconOnly onClick={onClose}>
              <X />
            </Link>
          </ToolbarPane>
        </Toolbar>

        <div className="flex-1 min-h-0 mb-8 px-8 overflow-auto">
          <div className="divide-y divide-gray-100">
            <FormRow label="제목">
              <input
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                className="flex-1 text-xl text-gray-900 outline-none"
                placeholder="입력하세요."
              />
            </FormRow>

            <FormRow label="분류">
              <div className="grid grid-cols-3 gap-x-4">
                {STATUS_OPTIONS.map(({ value, label, color }) => (
                  <button
                    key={value}
                    onClick={() => setStatus(value)}
                    className={`border py-1 px-5 text-sm font-medium transition-colors ${
                      status === value ? color : "text-gray-300 border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </FormRow>

            <FormRow label="장소">
              <input
                type="text"
                value={form.location}
                onChange={handleChange("location")}
                className="flex-1 text-xl text-gray-900 outline-none"
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
              <input
                type="text"
                value={form.fee}
                onChange={handleChange("fee")}
                inputMode="numeric"
                className="min-w-0 flex-1 text-xl text-gray-900 outline-none text-right"
              />
              <span className="ml-1 shrink-0 text-xl text-gray-900">원</span>
            </FormRow>

            <FormRow label="인원">
              <input
                type="text"
                value={form.maxStudents}
                onChange={handleChange("maxStudents")}
                inputMode="numeric"
                className="min-w-0 flex-1 text-xl text-gray-900 outline-none text-right"
              />
              <span className="ml-1 shrink-0 text-xl text-gray-900">명</span>
            </FormRow>

            <FormRow label="메모">
              <textarea
                className="flex-1 text-xl text-gray-900 outline-none resize-none overflow-hidden"
                rows={1}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }}
              />
            </FormRow>
          </div>
        </div>
      </div>

      <div className="px-10">
        <Button large rounded onClick={onClose}>
          추가
        </Button>
      </div>
    </Sheet>
  );
}
