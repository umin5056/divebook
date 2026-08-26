import { useQuery } from "@tanstack/react-query";
import { getStudentsDailyTrend, getStudentsMonthlyTrend } from "../api/student";

export function useStudentsDailyTrend() {
  return useQuery({
    queryKey: ["studentsDailyTrend"],
    queryFn: () => getStudentsDailyTrend().then((res) => res.data),
  });
}
export function useStudentsMonthlyTrend() {
  return useQuery({
    queryKey: ["studentsMonthlyTrend"],
    queryFn: () => getStudentsMonthlyTrend().then((res) => res.data),
  });
}
