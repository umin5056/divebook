import { useState } from "react";
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

// TODO: 백엔드 통계 API 연동 전까지의 목업 데이터
const DAILY_DATA = [
  { label: "08-15", students: 8, lessons: 2 },
  { label: "08-16", students: 9, lessons: 3 },
  { label: "08-17", students: 9, lessons: 3 },
  { label: "08-18", students: 10, lessons: 3 },
  { label: "08-19", students: 10, lessons: 4 },
  { label: "08-20", students: 12, lessons: 4 },
  { label: "08-21", students: 13, lessons: 5 },
];

const MONTHLY_DATA = [
  { label: "2026-03", students: 4, lessons: 1 },
  { label: "2026-04", students: 6, lessons: 2 },
  { label: "2026-05", students: 7, lessons: 2 },
  { label: "2026-06", students: 9, lessons: 3 },
  { label: "2026-07", students: 11, lessons: 4 },
  { label: "2026-08", students: 13, lessons: 5 },
];

export default function TrendChart() {
  const [isDaily, setIsDaily] = useState(true);
  const data = isDaily ? DAILY_DATA : MONTHLY_DATA;

  return (
    <div className="flex flex-col  gap-2 p-3 rounded-xl border border-gray-400 bg-white">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">
          {isDaily ? "최근 7일" : "월별"} 증감 추이
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
