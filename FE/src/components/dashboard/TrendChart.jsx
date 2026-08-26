import { useState } from "react";
import {
  useStudentsDailyTrend,
  useStudentsMonthlyTrend,
} from "../../hooks/useStudentsTrend";
import {
  useLessonsDailyTrend,
  useLessonsMonthlyTrend,
} from "../../hooks/useLessonsTrend";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function TrendChart() {
  const [isDaily, setIsDaily] = useState(true);
  const { data: studentDailyTrend } = useStudentsDailyTrend();
  const { data: lessonsDailyTrend } = useLessonsDailyTrend();
  const { data: studentMonthlyTrend } = useStudentsMonthlyTrend();
  const { data: lessonsMonthlyTrend } = useLessonsMonthlyTrend();

  const data = isDaily
    ? mergeTrendArray(studentDailyTrend, lessonsDailyTrend)
    : mergeTrendArray(studentMonthlyTrend, lessonsMonthlyTrend);

  function mergeTrendArray(studentTrend, lessonTrend) {
    let trend = new Array();
    for (const idx in studentTrend) {
      const merge = { ...studentTrend[idx], ...lessonTrend[idx] };
      trend.push(merge);
    }

    return trend;
  }

  return (
    <div className="flex flex-col  gap-2 p-3 rounded-xl border border-gray-400 bg-white">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">
          {isDaily ? "일별" : "월별"} 추이
        </div>
        <div className="flex text-sm font-bold rounded-lg border border-gray-300 overflow-hidden">
          <button
            type="button"
            className={`px-3 py-1 ${isDaily ? "bg-[#008080] text-white" : "text-gray-500"}`}
            onClick={() => setIsDaily(true)}
          >
            일별
          </button>
          <button
            type="button"
            className={`px-3 py-1 ${!isDaily ? "bg-[#008080] text-white" : "text-gray-500"}`}
            onClick={() => setIsDaily(false)}
          >
            월별
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 28, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 5" stroke="#fff" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} width={28} />
          <Tooltip />
          <Legend wrapperStyle={{ width: "100%" }} />
          <Line
            type="monotone"
            dataKey="students"
            name="수강생"
            stroke="#008080"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="lessons"
            name="강습"
            stroke="#003366"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
