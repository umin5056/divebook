import { useQuery } from "@tanstack/react-query";
import { getLessons } from "../api/lesson";

export function useLessons() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: () => getLessons().then((res) => res.data),
  });
}
