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

const GenerateAnalyticsReportInputSchema = z.object({
  ticketData: z
    .string()
    .describe(
      'A string containing the data from processed tickets, including issue descriptions, affected services, and other relevant information.'
    ),
});
export type GenerateAnalyticsReportInput = z.infer<typeof GenerateAnalyticsReportInputSchema>;

const GenerateAnalyticsReportOutputSchema = z.object({
  reportSummary: z
    .string()
    .describe(
      'A concise summary of the analytics report, highlighting key trends, common issues, and areas for improvement in cloud services.'
    ),
  identifiedTrends: z
    .string()
    .describe('A list of identified trends in the processed tickets.'),
  commonIssues: z
    .string()
    .describe('A description of the common issues identified in the tickets.'),
  improvementAreas: z
    .string()
    .describe(
      'Suggested areas for improvement based on the analysis of the ticket data.'
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
  prompt: `You are an AI assistant specializing in generating analytics reports based on processed tickets.

  Analyze the provided ticket data to identify trends, common issues, and areas for improvement in our cloud services.

  Based on your analysis, create a concise report summary, list the identified trends, describe the common issues, and suggest areas for improvement.

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
    return output!;
  }
);
