'use server';

/**
 * @fileOverview Summarizes the issue described in a ticket.
 *
 * - summarizeIssue - A function that summarizes the issue.
 * - SummarizeIssueInput - The input type for the summarizeIssue function.
 * - SummarizeIssueOutput - The return type for the summarizeIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIssueInputSchema = z.object({
  ticketText: z.string().describe('The text content of the ticket.'),
});
export type SummarizeIssueInput = z.infer<typeof SummarizeIssueInputSchema>;

const SummarizeIssueOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the issue described in the ticket.'),
});
export type SummarizeIssueOutput = z.infer<typeof SummarizeIssueOutputSchema>;

export async function summarizeIssue(input: SummarizeIssueInput): Promise<SummarizeIssueOutput> {
  return summarizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIssuePrompt',
  input: {schema: SummarizeIssueInputSchema},
  output: {schema: SummarizeIssueOutputSchema},
  prompt: `You are an expert at summarizing technical support tickets.  Please provide a concise summary of the issue described in the following ticket text.\n\nTicket Text:\n{{{ticketText}}}`,
});

const summarizeIssueFlow = ai.defineFlow(
  {
    name: 'summarizeIssueFlow',
    inputSchema: SummarizeIssueInputSchema,
    outputSchema: SummarizeIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
