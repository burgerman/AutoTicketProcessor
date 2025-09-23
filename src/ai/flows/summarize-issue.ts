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
  title: z.string().describe('A short, descriptive title for the issue.'),
  summary: z.string().describe('A concise summary of the issue described in the ticket.'),
  category: z.string().describe('The category of the issue (e.g., Bug, Feature Request, Question).'),
  severity: z.string().describe('The severity of the issue (e.g., Low, Medium, High, Critical).'),
});
export type SummarizeIssueOutput = z.infer<typeof SummarizeIssueOutputSchema>;

export async function summarizeIssue(input: SummarizeIssueInput): Promise<SummarizeIssueOutput> {
  return summarizeIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIssuePrompt',
  input: {schema: SummarizeIssueInputSchema},
  output: {schema: SummarizeIssueOutputSchema},
  prompt: `You are an expert in preprocessing and summarizing technical support tickets. You're able to provide a concise and informative summary in JSON format of the issue described in the following ticket text. Your response should include a title, a summary, the issue category (e.g., Bug, Feature Request, Question), and the severity (e.g., Low, Medium, High, Critical).\n\nTicket Text:\n{{{ticketText}}}`,
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
