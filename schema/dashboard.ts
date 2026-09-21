/**
 * This is what is returned by backend for dashboard data
 class MetricResponse(BaseModel):
    pie_chart: dict[TicketStatus, int]
    violations_today: int
    total_violations: int
    tickets_issued: int
    tickets_pending: int
    tickets_appealed: int
    trend_analysis: list[TrendPoint]
    location_analysis: list[HistogramPoint]
 */
import { TicketStatus } from "./enums";

import { z } from "zod";


const trendPointSchema = z.object({
    happen: z.coerce.date(),
    violations: z.number(),
});

const histogramPointSchema = z.object({
    location: z.string(),
    violations: z.number(),
});

export const dashboardSchema = z.object({
    pie_chart: z.record(TicketStatus, z.number()),
    violations_today: z.number(),
    total_violations: z.number(),
    tickets_issued: z.number(),
    tickets_pending: z.number(),
    tickets_appealed: z.number(),
    trend_analysis: z.array(trendPointSchema),
    location_analysis: z.array(histogramPointSchema),
})

export type DashboardData = z.infer<typeof dashboardSchema>;
