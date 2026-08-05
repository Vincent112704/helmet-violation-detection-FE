import { z } from "zod";


export const METHODS = z.enum([
  "GET",
  "POST",
  "PUT",
  "DELETE",
]);

export const TicketStatus = z.enum([
  "issued",
  "pending",
  "false_alarm",
]);

export type methods = z.infer<typeof METHODS>;