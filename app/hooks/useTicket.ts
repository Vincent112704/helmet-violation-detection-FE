import { useCallback } from "react";
import { useFetch } from "./useFetch";
import { getViolationsTable } from "../../lib/services/violations" 

export function useTickets(page: number, pageSize: number) {
  const fetcher = useCallback(() => getViolationsTable(page, pageSize), [page, pageSize]);
  return useFetch(fetcher, [page, pageSize]);
}