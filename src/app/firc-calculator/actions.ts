'use server';

import type { ExtractFiraDataOutput } from '@/ai/flows/extract-fira-data';
import type { ErrorKey } from './error-definitions';

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

export async function calculateFircResult({
  extractedData,
}: {
  extractedData: ExtractFiraDataOutput;
}): Promise<{ data: FircResult | null; error: ErrorKey | null }> {
  try {
    const FREECURRENCY_API_KEY = process.env.FREECURRENCY_API_KEY || 'fca_live_kKJhVpXCQYJEOWhsFSQNXM3fvoXQaPbn0S3BSzT0';

    // Check for essential extracted data. bankFxRate is now optional.
    if (!extractedData.transactionDate || !extractedData.foreignCurrencyAmount || !extractedData.inrCredited || !extractedData.foreignCurrencyCode) {
        return { data: null, error: 'EXTRACTION_FAILED' };
    }

    const fxApiUrl = `https://api.freecurrencyapi.com/v1/historical?apikey=${FREECURRENCY_API_KEY}&date=${extractedData.transactionDate}&base_currency=${extractedData.foreignCurrencyCode}&currencies=INR`;
    
    const fxResponse = await fetch(fxApiUrl);
    
    if (!fxResponse.ok) {
        return { data: null, error: 'FX_API_ERROR' };
    }

    const fxData = await fxResponse.json();
    const midMarketRate = fxData.data?.[extractedData.transactionDate]?.INR;

    if (!midMarketRate) {
        return { data: null, error: 'FX_API_ERROR' };
    }

    const A = extractedData.foreignCurrencyAmount;
    const C = extractedData.inrCredited;
    const D = midMarketRate;

    // Ensure foreign currency amount is not zero to prevent division errors.
    if (A === 0) {
      return { data: null, error: 'EXTRACTION_FAILED' };
    }
    
    // Backend Developer Change: Calculate bank's FX rate if not provided in the FIRA.
    // This logic handles cases where the bank's FX rate is missing from the document.
    let finalBankFxRate: number;
    if (extractedData.bankFxRate && extractedData.bankFxRate > 0) {
      // Use the FX rate from the FIRA if it exists.
      finalBankFxRate = extractedData.bankFxRate;
    } else {
      // If bankFxRate is missing, calculate it by dividing INR credited by the foreign currency amount.
      finalBankFxRate = C / A;
    }

    // CRITICAL CALCULATION: Use the finalBankFxRate (either from FIRA or calculated)
    // to ensure accuracy and avoid rounding drift.
    const spread = D - finalBankFxRate;
    const hiddenCost = spread * A;
    const paisePerUnit = spread * 100;
    const basisPoints = (spread / D) * 10000;

    // For display purposes, the 'effective' rate is what the user actually received.
    const effectiveBankRate = C / A;

    const result: FircResult = {
        bankName: extractedData.bankName || 'Your Bank',
        transactionDate: extractedData.transactionDate,
        purposeCode: extractedData.purposeCode || 'N/A',
        foreignCurrencyCode: extractedData.foreignCurrencyCode,
        foreignCurrencyAmount: A,
        bankRate: finalBankFxRate, // Use the determined final rate.
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
    let errorKey: ErrorKey = 'UNKNOWN_ERROR';
    if (e instanceof Error) {
        if (e.message.includes('deadline')) {
            errorKey = 'TIMEOUT_ERROR';
        } else if (e.message.includes('extractFiraData')) {
            errorKey = 'EXTRACTION_FAILED';
        } else if (e.message.toLowerCase().includes('fetch')) {
            errorKey = 'NETWORK_ERROR';
        }
    }
    return { data: null, error: errorKey };
  }
}
