import { useQuery } from "@tanstack/react-query";
import { getLessonById } from "../api/lesson";

export function useLessonById(lessonId) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => getLessonById(lessonId).then((res) => res.data),
    enabled: !!lessonId,
  });
}
