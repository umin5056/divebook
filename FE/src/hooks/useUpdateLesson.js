import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLesson } from "../api/lesson";

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, data }) => updateLesson(lessonId, data),
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.setQueryData(["lessons"], (old) =>
        old
          ? old.map((lesson) =>
              lesson.lessonId === res.data.lessonId ? res.data : lesson,
            )
          : old,
      );
    },
  });
}
