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
  foreignCurrencyCode: z.string().describe('The 3-letter ISO currency code of the foreign currency (e.g., USD, EUR).'),
  foreignCurrencyAmount: z.number().describe('The amount in foreign currency.'),
  bankFxRate: z.number().describe('The bank FX rate on the FIRA.'),
  inrCredited: z.number().describe('The amount credited in INR.'),
  error: z.string().optional().describe('An error message if extraction fails for any reason.')
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
You are a world-class financial document analysis AI, specializing in Foreign Inward Remittance Advice (FIRA) documents from any bank, in any format (PDF, PNG, JPEG). Your task is to extract key financial data with extreme precision.

**Core Objective:** Extract the following fields from the provided FIRA document.

**Field Extraction Rules & Synonyms:**

1.  **\`bankName\`**:
    *   Look for the bank's logo or name at the top of the document.
    *   Common Banks: HDFC Bank, ICICI Bank, DBS, Citibank, etc.

2.  **\`transactionDate\`**:
    *   CRITICAL: This MUST be the actual date of the currency conversion or when funds were credited. It is **NOT** the date the FIRA document was issued or printed.
    *   **Prioritize labels in this order:**
        1.  "Value Date"
        2.  "Credit Date" / "Credited on"
        3.  "Transaction Date"
        4.  "Remittance Date"
        5.  "Paid on"
        6.  "Dated:" (but only if it's in the same row or section as the FX rate or credit amount).
        7.  Any date found physically close to the financial figures (FX rate, amounts).
    *   **Fallback ONLY if no priority date is found:** Use the general document date, like "Date:", "Issue Date", or "Advice Date".
    *   **CRITICALLY IMPORTANT:** Output the final selected date in **YYYY-MM-DD format**.
    *   Handle various input date formats (e.g., "DD/MM/YYYY", "MM/DD/YYYY", "DD-Mon-YYYY"). If a date is ambiguous (e.g., 01/02/2023), assume the DD/MM/YYYY format which is common in India.

3.  **\`purposeCode\`**:
    *   Look for "Purpose Code," "RBI Purpose Code," or "Remittance Purpose."
    *   It is typically a 'P' followed by numbers (e.g., P0101, P1099).

4.  **\`foreignCurrencyCode\`**:
    *   Identify the 3-letter ISO currency code for the foreign currency amount.
    *   Examples: USD, EUR, GBP, AUD, SGD, JPY. This is **NOT** INR.

5.  **\`foreignCurrencyAmount\`**:
    *   This is the amount in the foreign currency (identified in \`foreignCurrencyCode\`).
    *   Look for labels like "Foreign Amount," "Amount in FCY," or the currency code itself (e.g., "USD Amount").
    *   Strip all commas and currency symbols. It must be a number.

6.  **\`bankFxRate\`**:
    *   Find the "Exchange Rate," "FX Rate," "Rate," or "Conversion Rate" applied by the bank.
    *   This is the rate used to convert the foreign currency to INR.

7.  **\`inrCredited\`**:
    *   Find the final credited amount in INR.
    *   Look for "Amount in INR," "INR Equivalent," or "Net Amount Credited."
    *   Strip all commas and currency symbols. It must be a number.

**Validation and Error Handling:**

*   If you cannot reliably find a **required** value (\`transactionDate\`, \`foreignCurrencyCode\`, \`foreignCurrencyAmount\`, \`inrCredited\`), you MUST set the \`error\` field in your output with a descriptive message (e.g., "Could not determine the transaction date.").
*   For other non-critical fields (\`bankName\`, \`purposeCode\`, \`bankFxRate\`), if they are not found, return an empty string "" for strings or 0 for numbers. Do not set the error field for these.

**Output Format:**

*   You **MUST** output **ONLY** a single, valid JSON object that conforms to the specified schema. Do not add any extra text, commentary, or markdown formatting like \`\`\`json.

Here is the FIRA document:
{{media url=firaDataUri}}

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
