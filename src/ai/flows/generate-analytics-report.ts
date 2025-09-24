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
      'A concise summary of the analytics report, highlighting key issues, common issues, and areas for improvement in cloud services.'
    ),
  issueType: z
    .string()
    .describe(
      'Type of issue identified (e.g., Performance, Security, Availability, Consistency, Persistency).'
    ),
  identifiedIssues: z.array(z.object({
    issue: z.string().describe("A specific issue identified."),
    description: z.string().describe("A description of the issue."),
    count: z.number().describe("Number of tickets related to this issue.")
  })).describe("A list of identified issues in the processed tickets."),
  commonCauses: z.array(z.object({
    cause: z.string().describe("The most common cause."),
    description: z.string().describe("Description of the cause and its impact."),
    suggestedTeam: z.string().describe("The downstream support team to route the ticket to.")
  })).describe('A description of the common issues identified in the tickets.'),
  solutions: z.array(z.string()).describe(
      'Suggested fixes or solutions based on the identified issues.'
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
  prompt: `You are an AI assistant specializing in analyzing the summary of the issue ticket and generating analytics reports based on the given summary.

  Analyze the provided ticket data to identify type of issues, key issues, common causes of these issues, and known fixes or solutions to these issues.

  Based on your analysis, please create a concise report summary. The report should include the type of issue identified (e.g., Performance, Security, Availability, Consistency, Persistency), list the identified issues (as an array of objects with issue, description, and suggestedTeam), describe the common causes of these issues, and suggest which downstream support team the ticket should be routed to. Also, provide a list of identified issues (as an array of objects with trend, description, and count) and a list of improvement areas (as an array of strings).

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
