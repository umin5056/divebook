import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLesson } from "../api/lesson";

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLesson,
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.setQueryData(["lessons"], (old) =>
        old ? [...old, res.data] : old,
      );
    },
  });
}
