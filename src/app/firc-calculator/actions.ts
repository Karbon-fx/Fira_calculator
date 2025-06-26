'use server';

import { extractFiraData } from '@/ai/flows/extract-fira-data';
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

export async function analyzeFira({
  firaDataUri,
}: {
  firaDataUri: string;
}): Promise<{ data: FircResult | null; error: ErrorKey | null }> {
  try {
    const FREECURRENCY_API_KEY = process.env.FREECURRENCY_API_KEY || 'fca_live_kKJhVpXCQYJEOWhsFSQNXM3fvoXQaPbn0S3BSzT0';

    const extractedData = await extractFiraData({ firaDataUri });

    if (extractedData.error) {
      return { data: null, error: 'EXTRACTION_FAILED' };
    }

    if (!extractedData.transactionDate || !extractedData.foreignCurrencyAmount || !extractedData.inrCredited || !extractedData.foreignCurrencyCode || !extractedData.bankFxRate) {
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
    const bankFxRate = extractedData.bankFxRate;

    if (A === 0) {
      return { data: null, error: 'EXTRACTION_FAILED' };
    }
    
    // CRITICAL CALCULATION: Use the extracted bankFxRate and full-precision spread
    // to ensure accuracy and avoid rounding drift from re-deriving the rate.
    const spread = D - bankFxRate;
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
        bankRate: bankFxRate,
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
