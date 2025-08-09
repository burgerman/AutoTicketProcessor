import type { ExtractTicketDataOutput } from "@/ai/flows/extract-ticket-data";
import type { GenerateAnalyticsReportOutput } from "@/ai/flows/generate-analytics-report";

export type ExtractedTicketData = ExtractTicketDataOutput & {
  ticketText: string;
};

export type AnalyticsReport = GenerateAnalyticsReportOutput;
