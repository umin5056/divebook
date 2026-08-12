import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLesson } from "../api/lesson";

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, data }) => updateLesson(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}
