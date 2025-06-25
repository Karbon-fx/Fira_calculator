'use server';
/**
 * @fileOverview Extracts data from a FIRA document using OCR and LLM reasoning.
 *
 * - extractFiraData - A function that handles the FIRA data extraction process.
 * - ExtractFiraDataInput - The input type for the extractFiraData function.
 * - ExtractFiraDataOutput - The return type for the extractFiraData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractFiraDataInputSchema = z.object({
  firaDataUri: z
    .string()
    .describe(
      "A FIRA document (PDF, PNG, JPEG) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractFiraDataInput = z.infer<typeof ExtractFiraDataInputSchema>;

const ExtractFiraDataOutputSchema = z.object({
  bankName: z.string().describe('The name of the bank that issued the FIRA.'),
  transactionDate: z.string().describe('The date of the transaction (YYYY-MM-DD).'),
  purposeCode: z.string().describe('The purpose code of the transaction.'),
  foreignCurrencyAmount: z.number().describe('The amount in foreign currency.'),
  bankFxRate: z.number().describe('The bank FX rate on the FIRA.'),
  inrCredited: z.number().describe('The amount credited in INR.'),
});
export type ExtractFiraDataOutput = z.infer<typeof ExtractFiraDataOutputSchema>;

export async function extractFiraData(input: ExtractFiraDataInput): Promise<ExtractFiraDataOutput> {
  return extractFiraDataFlow(input);
}

const extractFiraDataPrompt = ai.definePrompt({
  name: 'extractFiraDataPrompt',
  input: {schema: ExtractFiraDataInputSchema},
  output: {schema: ExtractFiraDataOutputSchema},
  prompt: `You are an expert financial document parser.

You will be provided with a Foreign Inward Remittance Advice (FIRA) document.
Your task is to extract the following information from the document:

- Bank Name
- Date of transaction (YYYY-MM-DD)
- Purpose code
- Foreign currency amount
- Bank FX rate on FIRA
- INR credited

Here is the FIRA document:

{{media url=firaDataUri}}

Extract the information and respond in the JSON format.
Ensure that the extracted values are accurate and correctly formatted.
If a field is not present, leave it blank.
`,
});

const extractFiraDataFlow = ai.defineFlow(
  {
    name: 'extractFiraDataFlow',
    inputSchema: ExtractFiraDataInputSchema,
    outputSchema: ExtractFiraDataOutputSchema,
  },
  async input => {
    const {output} = await extractFiraDataPrompt(input);
    return output!;
  }
);
