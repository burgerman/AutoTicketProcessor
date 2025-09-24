'use server';

/**
 * @fileOverview A flow for generating intelligent analytics reports based on processed tickets.
 *
 * - generateAnalyticsReport - A function that generates analytics reports from ticket data.
 * - GenerateAnalyticsReportInput - The input type for the generateAnalyticsReport function.
 * - GenerateAnalyticsReportOutput - The return type for the generateAnalyticsReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveAnalyticsReport } from '@/lib/supabase';

const GenerateAnalyticsReportInputSchema = z.object({
  ticketData: z
    .string()
    .describe(
      'A string containing the data from the summary of the raw ticket, including issue descriptions, impacted services, and other key information.'
    ),
});
export type GenerateAnalyticsReportInput = z.infer<typeof GenerateAnalyticsReportInputSchema>;

const GenerateAnalyticsReportOutputSchema = z.object({
  reportSummary: z
    .string()
    .describe(
      'A concise summary of the analytics report, highlighting key issues, common causes, and quick fixes.'
    ),
  identifiedIssues: z
    .string()
    .describe('A list of identified issues in the ticket.'),
  commonCauses: z
    .string()
    .describe('A description of the common issues identified in the ticket data.'),
  solutions: z
    .string()
    .describe(
      'Suggested fixes or solutions to identified issues based on the analysis of the ticket data.'
    ),
});
export type GenerateAnalyticsReportOutput = z.infer<typeof GenerateAnalyticsReportOutputSchema>;

export async function generateAnalyticsReport(
  input: GenerateAnalyticsReportInput
): Promise<GenerateAnalyticsReportOutput> {
  return generateAnalyticsReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnalyticsReportPrompt',
  input: {schema: GenerateAnalyticsReportInputSchema},
  output: {schema: GenerateAnalyticsReportOutputSchema},
  prompt: `You are an expert specializing in analyzing issue tickets and generating analytics reports based on the summary of the tickets

  Analyze the given ticket data to identify issues, common causes, and solutions in our cloud services.

  Based on the analysis, create a concise and professional report summary, list the identified issues, describe the common causes, and suggest known fixes or solutions to these issues.

  Ticket Data: {{{ticketData}}}
  `,
});

const generateAnalyticsReportFlow = ai.defineFlow(
  {
    name: 'generateAnalyticsReportFlow',
    inputSchema: GenerateAnalyticsReportInputSchema,
    outputSchema: GenerateAnalyticsReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (output) {
      await saveAnalyticsReport(output);
    }
    return output!;
  }
);
