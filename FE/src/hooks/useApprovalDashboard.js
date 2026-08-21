import { useQuery } from "@tanstack/react-query";
import { getApprovalDashboard } from "../api/dashboard";

export function useApprovalDashboard() {
  return useQuery({
    queryKey: ["approvalDashboard"],
    queryFn: () => getApprovalDashboard().then((res) => res.data),
  });
}
