'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { extractTicketData, type ExtractTicketDataInput, type ExtractTicketDataOutput } from "@/ai/flows/extract-ticket-data";
import { generateAnalyticsReport, type GenerateAnalyticsReportInput, type GenerateAnalyticsReportOutput } from "@/ai/flows/generate-analytics-report";

const PROCESSED_TICKETS_FILE = path.join(process.cwd(), 'processed-tickets.json');

async function saveProcessedTicket(ticket: ExtractTicketDataOutput) {
  let tickets: ExtractTicketDataOutput[] = [];
  try {
    const fileContent = await fs.readFile(PROCESSED_TICKETS_FILE, 'utf-8');
    if (fileContent) {
      tickets = JSON.parse(fileContent);
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.error('Error reading processed tickets file:', error);
      // We can still proceed to try and write the file
    }
  }
  tickets.unshift(ticket);
  await fs.writeFile(PROCESSED_TICKETS_FILE, JSON.stringify(tickets, null, 2));
}


export async function handleExtractTicketData(
  input: ExtractTicketDataInput
): Promise<ExtractTicketDataOutput | { error: string }> {
  try {
    const result = await extractTicketData(input);
    await saveProcessedTicket(result);
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