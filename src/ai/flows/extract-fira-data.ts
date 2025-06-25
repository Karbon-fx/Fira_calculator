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
  input: { schema: ExtractFiraDataInputSchema },
  output: { schema: ExtractFiraDataOutputSchema },
  prompt: `
You are an expert financial-document parser specialized in Foreign Inward Remittance Advice (FIRA) from banks worldwide.

User Stories:
1. As a finance manager, I need the parser to identify my bank’s name so I can trust the source.
2. As an accounting clerk, I want the exact transaction date in YYYY-MM-DD format for ledger entry.
3. As a compliance officer, I need the purpose code to audit tax reporting.
4. As a treasurer, I require the foreign currency code and amount so I can reconcile multi-currency receipts.
5. As a CFO, I must see the bank’s FX rate and the final INR credited to verify hidden costs.

Your Tasks:
1. Detect any 3-letter currency code (e.g., USD, EUR, GBP, AUD, JPY…) and extract:
   - \`foreignCurrencyAmount\` (numeric, strip commas/symbols)
   - \`bankFxRate\` (the “Rate” on the FIRA for that currency → INR)
   - \`inrCredited\` (the “INR Amount” credited)

2. Extract and validate these required fields:
   - \`bankName\`
   - \`transactionDate\` → output as “YYYY-MM-DD”
   - \`purposeCode\` → typically “Pxxxx”
   - \`foreignCurrencyAmount\` → must be > 0
   - \`bankFxRate\` → must be > 0
   - \`inrCredited\` → must be > 0
   If any field is missing or invalid, set it to an empty string or zero and include an \`"error"\` key in your JSON.

3. Do **not** assume USD—use whichever currency you detect.

4. Output **only** this JSON shape (no extra commentary):
\`\`\`json
{
  "bankName":        string,
  "transactionDate": string,
  "purposeCode":     string,
  "foreignCurrencyAmount": number,
  "bankFxRate":      number,
  "inrCredited":     number
}
\`\`\`

Here is the FIRA document:

\`\`\`
{{media url=firaDataUri}}
\`\`\`

Begin extraction now.
`
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
