import { useQuery } from "@tanstack/react-query";
import { getLessonsDailyTrend, getLessonsMonthlyTrend } from "../api/lesson";

export function useLessonsDailyTrend() {
  return useQuery({
    queryKey: ["lessonsDailyTrend"],
    queryFn: () => getLessonsDailyTrend().then((res) => res.data),
  });
}
export function useLessonsMonthlyTrend() {
  return useQuery({
    queryKey: ["lessonsMonthlyTrend"],
    queryFn: () => getLessonsMonthlyTrend().then((res) => res.data),
  });
}
