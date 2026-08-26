import { useQuery } from "@tanstack/react-query";
import { getLessonApprovals } from "../api/dashboard";

export function useLessonApproval() {
  return useQuery({
    queryKey: ["lessonApprovals"],
    queryFn: () => getLessonApprovals().then((res) => res.data),
  });
}
