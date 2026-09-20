import { z } from "zod";


export const METHODS = z.enum([
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH"
]);

export const TicketStatus = z.enum([
  "issued",
  "pending",
  "false_alarm",
]);

export type Methods = z.infer<typeof METHODS>;