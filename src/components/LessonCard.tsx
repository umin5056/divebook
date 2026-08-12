import { useRef, useState } from "react";
import { Card } from "konsta/react";
import { MapPin, Clock } from "lucide-react";
import type { LessonResponse } from "../api/lesson";

interface LessonCardProps {
  lesson: LessonResponse;
  onCancel: (lesson: LessonResponse) => void;
  onPress: (lesson: LessonResponse) => void;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  open: { label: "진행", color: "bg-blue-500" },
  closed: { label: "마감", color: "bg-red-500" },
  cancelled: { label: "취소", color: "bg-gray-400" },
};

const CANCEL_BUTTON_WIDTH = 80;

export default function LessonCard({
  lesson,
  onCancel,
  onPress,
}: LessonCardProps) {
  const statusStyle = STATUS_LABEL[lesson.status];
  const [offsetX, setOffsetX] = useState(0);
  const startXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const delta = e.touches[0].clientX - startXRef.current;
    const clamped = Math.min(0, Math.max(-(CANCEL_BUTTON_WIDTH + 10), delta));
    setOffsetX(clamped);
  };

  const handleTouchEnd = () => {
    if (offsetX < -CANCEL_BUTTON_WIDTH / 2) {
      setOffsetX(-(CANCEL_BUTTON_WIDTH + 10));
    } else {
      setOffsetX(0);
    }
    startXRef.current = null;
  };

  return (
    <div className="relative">
      <div
        className="absolute right-4 top-2 bottom-2 flex items-center justify-center bg-gray-500 rounded-3xl"
        style={{ width: CANCEL_BUTTON_WIDTH }}
        onClick={() => {
          setOffsetX(0);
          onCancel(lesson);
        }}
      >
        <span className="text-white text-lg font-bold">취 소</span>
      </div>

      <div
        className="relative transition-transform"
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => offsetX === 0 && onPress(lesson)}
      >
        <Card>
          <div className="flex items-start justify-between gap-2">
            <div className="text-xl font-bold text-gray-900">
              {lesson.title}
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-0.5 text-lg font-bold text-white ${statusStyle.color}`}
            >
              {statusStyle.label}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 font-bold text-sm text-gray-500">
            <Clock size={14} />
            <span>{lesson.lessonDate}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span>
              {lesson.startTime} - {lesson.endTime}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 font-bold text-base text-gray-500">
            <MapPin size={14} className="shrink-0" />
            <span className="flex-1 min-w-0">{lesson.location}</span>
            <span className="shrink-0">
              인원: {lesson.enrollmentCount}/{lesson.maxStudents}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
