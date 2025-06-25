'use server';

import { extractFiraData } from '@/ai/flows/extract-fira-data';
import { z } from 'zod';

const FREECURRENCY_API_KEY = 'fca_live_kKJhVpXCQYJEOWhsFSQNXM3fvoXQaPbn0S3BSzT0';
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

export interface FircResult {
  transactionDate: string;
  purposeCode: string;
  foreignCurrencyAmount: number;
  bankFxRateOnFira: number;
  inrCredited: number;
  midMarketRate: number;
  effectiveBankRate: number;
  spread: number;
  totalCost: number;
  paisePerUnit: number;
  basisPoints: number;
}

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, 'File is empty.')
  .refine(
    (file) => file.size <= MAX_FILE_SIZE_BYTES,
    `File size must be less than ${MAX_FILE_SIZE_MB}MB.`
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'Invalid file type. Only PDF, PNG, and JPEG are accepted.'
  );
  
export async function processFiraDocument(
  prevState: any,
  formData: FormData
): Promise<{ data: FircResult | null; error: string | null; }> {
  try {
    const file = formData.get('firaDocument') as File;
    const validatedFile = fileSchema.safeParse(file);

    if (!validatedFile.success) {
      return { data: null, error: validatedFile.error.errors[0].message };
    }

    const fileBuffer = await file.arrayBuffer();
    const dataUri = `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;

    const extractedData = await extractFiraData({ firaDataUri: dataUri });

    if (!extractedData.transactionDate || !extractedData.foreignCurrencyAmount || !extractedData.inrCredited) {
        return { data: null, error: 'OCR failed to extract necessary data. Please try another document or a clearer image.' };
    }
    
    const fxApiUrl = `https://api.freecurrencyapi.com/v1/historical?apikey=${FREECURRENCY_API_KEY}&date=${extractedData.transactionDate}&base_currency=USD&currencies=INR`;
    
    const fxResponse = await fetch(fxApiUrl);
    
    if (!fxResponse.ok) {
        return { data: null, error: `Could not fetch FX rate for ${extractedData.transactionDate}. The API may not have data for this date.` };
    }

    const fxData = await fxResponse.json();
    const midMarketRate = fxData.data?.[extractedData.transactionDate]?.INR;

    if (!midMarketRate) {
        return { data: null, error: `FX rate not found for ${extractedData.transactionDate}.` };
    }

    const A = extractedData.foreignCurrencyAmount;
    const C = extractedData.inrCredited;
    const D = midMarketRate;

    if (A === 0) {
      return { data: null, error: 'Foreign currency amount cannot be zero.' };
    }

    const effectiveBankRate = C / A;
    const spread = D - effectiveBankRate;
    const totalCost = spread * A;
    const paisePerUnit = spread * 100;
    const basisPoints = (spread / D) * 10000;

    const result: FircResult = {
        transactionDate: extractedData.transactionDate,
        purposeCode: extractedData.purposeCode || 'N/A',
        foreignCurrencyAmount: A,
        bankFxRateOnFira: extractedData.bankFxRate,
        inrCredited: C,
        midMarketRate: D,
        effectiveBankRate,
        spread,
        totalCost,
        paisePerUnit,
        basisPoints,
    };
    
    return { data: result, error: null };

  } catch (e) {
    console.error(e);
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (e instanceof Error) {
        if (e.message.includes('deadline')) {
            errorMessage = 'The request timed out. The document may be too complex. Please try again.';
        } else if (e.message.includes('extractFiraData')) {
            errorMessage = 'Failed to analyze document. Please ensure it is a valid FIRA.';
        }
    }
    return { data: null, error: errorMessage };
  }
}
