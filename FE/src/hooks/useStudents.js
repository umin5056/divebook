import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../api/student";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents().then((res) => res.data),
  });
}
