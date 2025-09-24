'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { extractTicketData, type ExtractTicketDataInput, type ExtractTicketDataOutput } from "@/ai/flows/extract-ticket-data";
import { generateAnalyticsReport, type GenerateAnalyticsReportInput, type GenerateAnalyticsReportOutput } from "@/ai/flows/generate-analytics-report";
import type {AnalyticsReport} from "@/lib/types";
import {saveAnalyticsReportSupabase} from "@/lib/supabase";

const PROCESSED_TICKETS_DIR = path.join(process.cwd(), 'processed-tickets');
const ANALYTICS_REPORTS_DIR = path.join(process.cwd(), 'analytics-reports');

function generateTicketNumber(ticket: ExtractTicketDataOutput): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

  // Assuming the ticket object has an 'issueType' property.
  const issueTypeRaw = (ticket as any).issueType;
  const issueType = (typeof issueTypeRaw === 'string' && issueTypeRaw ? issueTypeRaw : 'general')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // remove special chars except space
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .slice(0, 20); // limit length

  // const randomPart = Math.random().toString(36).substring(2, 8);

  return `${issueType}-${timestamp}`;
}


function generateReportNumber(report: GenerateAnalyticsReportOutput): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

  // Assuming the ticket object has an 'issueType' property.
  const issueTypeRaw = (report as any).issueType;
  const issueType = (typeof issueTypeRaw === 'string' && issueTypeRaw ? issueTypeRaw : 'general')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // remove special chars except space
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .slice(0, 20); // limit length

  // const randomPart = Math.random().toString(36).substring(2, 8);

  return `${issueType}-${timestamp}`;
}

async function saveProcessedTicket(ticket: ExtractTicketDataOutput) {
  const ticketNumber = generateTicketNumber(ticket);
  const ticketWithId = { ...ticket, ticketNumber };
  const filePath = path.join(PROCESSED_TICKETS_DIR, `${ticketNumber}.json`);

  try {
    await fs.mkdir(PROCESSED_TICKETS_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(ticketWithId, null, 2));
  } catch (error) {
    console.error(`Error saving ticket ${ticketNumber}:`, error);
    throw error; // Re-throw to be caught by the calling function
  }
}

async function saveAnalyticsReport(report: AnalyticsReport) {

  const reportNumber = generateReportNumber(report);
  const reportWithId = { ...report, reportNumber };
  const filePath = path.join(ANALYTICS_REPORTS_DIR, `${reportNumber}.json`);

  try {
    await fs.mkdir(ANALYTICS_REPORTS_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(reportWithId, null, 2));
    await saveAnalyticsReportSupabase(report, reportNumber);
  } catch (error) {
    console.error(`Error saving ticket ${reportNumber}:`, error);
    throw error; // Re-throw to be caught by the calling function
  }
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
      await saveAnalyticsReport(result);
      return result;
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      return { error: `Failed to generate analytics report: ${errorMessage}` };
    }
  }