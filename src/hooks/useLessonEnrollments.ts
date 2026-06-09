import { useQuery } from "@tanstack/react-query";
import { getLessonEnrollments } from "../api/lesson";

export function useLessonEnrollments(lessonId: string | null) {
  return useQuery({
    queryKey: ["lessons", lessonId, "enrollments"],
    queryFn: () => getLessonEnrollments(lessonId!).then((res) => res.data),
    enabled: !!lessonId,
  });
}
