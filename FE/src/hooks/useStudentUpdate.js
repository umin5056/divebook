import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent } from "../api/student";

export function useStudentUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, content }) => updateStudent(studentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}
