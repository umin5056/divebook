import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLesson } from "../api/lesson";

export function useLessonUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, data }) => updateLesson(lessonId, data),
    onSuccess: (_data, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({
        queryKey: ["lesson", String(lessonId)],
      });
    },
  });
}
