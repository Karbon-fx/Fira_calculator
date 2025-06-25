'use server';

import { extractFiraData } from '@/ai/flows/extract-fira-data';

const FREECURRENCY_API_KEY = process.env.FREECURRENCY_API_KEY || 'fca_live_kKJhVpXCQYJEOWhsFSQNXM3fvoXQaPbn0S3BSzT0';

export interface FircResult {
  bankName: string;
  transactionDate: string;
  purposeCode: string;
  foreignCurrencyCode: string;
  foreignCurrencyAmount: number;
  bankRate: number;
  inrCredited: number;
  midMarketRate: number;
  effectiveBankRate: number;
  spread: number;
  hiddenCost: number;
  paisePerUnit: number;
  basisPoints: number;
}

export async function analyzeFira({
  firaDataUri,
}: {
  firaDataUri: string;
}): Promise<{ data: FircResult | null; error: string | null }> {
  try {
    const extractedData = await extractFiraData({ firaDataUri });

    if (extractedData.error) {
      return { data: null, error: extractedData.error };
    }

    if (!extractedData.transactionDate || !extractedData.foreignCurrencyAmount || !extractedData.inrCredited || !extractedData.foreignCurrencyCode || !extractedData.bankFxRate) {
        return { data: null, error: 'OCR failed to extract all required data. Please try another document or a clearer image.' };
    }
    
    const fxApiUrl = `https://api.freecurrencyapi.com/v1/historical?apikey=${FREECURRENCY_API_KEY}&date=${extractedData.transactionDate}&base_currency=${extractedData.foreignCurrencyCode}&currencies=INR`;
    
    const fxResponse = await fetch(fxApiUrl);
    
    if (!fxResponse.ok) {
        const apiError = await fxResponse.json();
        const errorMessage = apiError.message || `Could not fetch FX rate for ${extractedData.transactionDate}. The API may not have data for this date or currency.`;
        return { data: null, error: errorMessage };
    }

    const fxData = await fxResponse.json();
    const midMarketRate = fxData.data?.[extractedData.transactionDate]?.INR;

    if (!midMarketRate) {
        return { data: null, error: `FX rate not found for ${extractedData.foreignCurrencyCode} on ${extractedData.transactionDate}.` };
    }

    const A = extractedData.foreignCurrencyAmount;
    const C = extractedData.inrCredited;
    const D = midMarketRate;

    if (A === 0) {
      return { data: null, error: 'Foreign currency amount cannot be zero.' };
    }

    // Use the extracted bankFxRate directly for calculations
    const spread = D - extractedData.bankFxRate;
    const hiddenCost = spread * A;
    const paisePerUnit = spread * 100;
    const basisPoints = (spread / D) * 10000;

    // For display purposes, the 'effective' rate is still what the user actually received.
    const effectiveBankRate = C / A;

    const result: FircResult = {
        bankName: extractedData.bankName || 'Your Bank',
        transactionDate: extractedData.transactionDate,
        purposeCode: extractedData.purposeCode || 'N/A',
        foreignCurrencyCode: extractedData.foreignCurrencyCode,
        foreignCurrencyAmount: A,
        bankRate: extractedData.bankFxRate,
        inrCredited: C,
        midMarketRate: D,
        effectiveBankRate: effectiveBankRate,
        spread,
        hiddenCost: hiddenCost,
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
