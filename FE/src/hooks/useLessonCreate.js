import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLesson } from "../api/lesson";

export function useLessonCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}
