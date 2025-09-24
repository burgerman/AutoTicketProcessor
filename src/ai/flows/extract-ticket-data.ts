'use server';

/**
 * @fileOverview A ticket data extraction AI agent.
 *
 * - extractTicketData - A function that handles the ticket data extraction process.
 * - ExtractTicketDataInput - The input type for the extractTicketData function.
 * - ExtractTicketDataOutput - The return type for the extractTicketData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTicketDataInputSchema = z.object({
  ticketText: z.string().describe('The text content of the support ticket.'),
});
export type ExtractTicketDataInput = z.infer<typeof ExtractTicketDataInputSchema>;

const ExtractTicketDataOutputSchema = z.object({
  affectedService: z.string().describe('The service affected by the issue.'),
  issueType: z.string().describe('The type of issue reported in the ticket.'),
  priority: z.string().describe('The priority level of the ticket (e.g., High, Medium, Low).'),
  summary: z.string().describe('A brief summary of the ticket issue.'),
});
export type ExtractTicketDataOutput = z.infer<typeof ExtractTicketDataOutputSchema>;

export async function extractTicketData(input: ExtractTicketDataInput): Promise<ExtractTicketDataOutput> {
  return extractTicketDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTicketDataPrompt',
  input: {schema: ExtractTicketDataInputSchema},
  output: {schema: ExtractTicketDataOutputSchema},
  prompt: `You are an expert in preprocessing and summarizing issue tickets.
You should analyze the raw ticket text and extract key information, including the impacted service, issue type, and priority.
You should also generate a concise summary of the issue ticket.

Ticket Text: {{{ticketText}}}
`,
});

const extractTicketDataFlow = ai.defineFlow(
  {
    name: 'extractTicketDataFlow',
    inputSchema: ExtractTicketDataInputSchema,
    outputSchema: ExtractTicketDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
