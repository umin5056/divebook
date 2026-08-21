import { useQuery } from "@tanstack/react-query";
import { getLessonsByDate } from "../api/lesson";

export function useLessonsByDate(date) {
  return useQuery({
    queryKey: ["lessons", date],
    queryFn: () => getLessonsByDate(date).then((res) => res.data),
  });
}
