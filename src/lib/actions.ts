'use server';

import { extractTicketData, type ExtractTicketDataInput, type ExtractTicketDataOutput } from "@/ai/flows/extract-ticket-data";
import { generateAnalyticsReport, type GenerateAnalyticsReportInput, type GenerateAnalyticsReportOutput } from "@/ai/flows/generate-analytics-report";

export async function handleExtractTicketData(
  input: ExtractTicketDataInput
): Promise<ExtractTicketDataOutput | { error: string }> {
  try {
    const result = await extractTicketData(input);
    return result;
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to extract ticket data: ${errorMessage}` };
  }
}

export async function handleGenerateAnalyticsReport(
    input: GenerateAnalyticsReportInput
  ): Promise<GenerateAnalyticsReportOutput | { error: string }> {
    try {
      const result = await generateAnalyticsReport(input);
      return result;
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      return { error: `Failed to generate analytics report: ${errorMessage}` };
    }
  }
