import { useState } from "react";

import { useLessonsByDate } from "../hooks/useLessonsByDate";
import TrendChart from "../components/dashboard/TrendChart";
import LessonCard from "../components/lesson/LessonCard";

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  const [isToday, setIsToday] = useState(true);

  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + (isToday ? 0 : 1));

  const { data: lessons = [] } = useLessonsByDate(toDateString(targetDate));

  return (
    <div className="flex flex-col px-3 gap-5">
      <TrendChart />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end font-bold">
          <div className="text-xl">
            {isToday ? "오늘" : "내일"} 강습 ({lessons.length})
          </div>
          <div className="text-[#008080]" onClick={() => setIsToday((p) => !p)}>
            {!isToday ? "오늘" : "내일"}
          </div>
        </div>

        <div className="flex gap-3 overflow-auto snap-x snap-mandatory">
          {lessons.map((e) => (
            <LessonCard key={e.lessonId} {...e} />
          ))}
        </div>
      </div>
    </div>
  );
}
