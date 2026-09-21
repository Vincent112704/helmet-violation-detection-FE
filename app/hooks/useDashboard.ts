
import { useCallback } from "react";
import { useFetch } from "./useFetch";
import { getDashboardData } from "../../lib/services/dashboard";

export function useDashboardData() {
  const fetcher = useCallback(() => getDashboardData(), []);
  return useFetch(fetcher);
}