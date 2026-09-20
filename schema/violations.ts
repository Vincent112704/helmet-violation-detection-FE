import { z } from "zod";

export const TicketStatusSchema = z.enum([
  "pending",
  "issued",
  "false_alarm",
]);

const UUIDSchema = z.uuid();
const DateTimeSchema = z.coerce.date()

export const TicketSchema = z.object({
  ticket_id: UUIDSchema,
  officer: UUIDSchema,
  status: TicketStatusSchema,
  plate_number: z.string().nullable().optional(),
  location: z.string(),
  timestamp: DateTimeSchema,
  url: z.string().nullable().optional(),
});

export const PaginatedTicketsSchema = z.object({
  items: z.array(TicketSchema),
  page: z.number().int(),
  page_size: z.number().int(),
});

export const TicketTableResponseSchema = z.object({
  data: PaginatedTicketsSchema,
  count: z.number().int(),
});

// Request body for updating a ticket's status
export const UpdateTicketStatusRequestSchema = z.object({
  status: TicketStatusSchema,
});


export type TicketStatus = z.infer<typeof TicketStatusSchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type PaginatedTickets = z.infer<typeof PaginatedTicketsSchema>;
export type TicketTableResponse = z.infer<typeof TicketTableResponseSchema>;
export type UpdateTicketStatusRequest = z.infer<typeof UpdateTicketStatusRequestSchema>;