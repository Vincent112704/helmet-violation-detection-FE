import { useCallback, useState } from "react";
import { useFetch } from "./useFetch";
import { getViolationsTable, deleteViolation, patchViolation } from "../../lib/services/violations" 
import { type TicketStatus } from '../../schema/violations';

type TicketId = Parameters<typeof deleteViolation>[0];
 
 
export interface ViolationFields {
  location: string;
  status: TicketStatus;
  plate_number: string;
}
 
/**
 * Generic wrapper for a service call that mutates data:
 * tracks pending/error state and resolves to true/false instead of throwing.
 */
function useAction<Args extends unknown[]>(action: (...args: Args) => Promise<void>) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const run = useCallback(
    async (...args: Args): Promise<boolean> => {
      setIsPending(true);
      setError(null);
      try {
        await action(...args);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [action]
  );
 
  const reset = useCallback(() => setError(null), []);
 
  return { run, isPending, error, reset };
}
 
export function useUpdateViolation() {
  const { run, ...state } = useAction(patchViolation);
 
  const update = useCallback(
    (ticketId: TicketId, fields: ViolationFields) =>
      run(fields.location, fields.status, fields.plate_number, ticketId),
    [run]
  );
 
  return { update, ...state };
}
 
export function useDeleteViolation() {
  const { run, ...state } = useAction(deleteViolation);
  return { remove: run, ...state };
}

export function useTickets(page: number, pageSize: number) {
  const fetcher = useCallback(() => getViolationsTable(page, pageSize), [page, pageSize]);
  return useFetch(fetcher, [page, pageSize]);
}



