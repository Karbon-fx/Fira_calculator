'use client';

import { format } from 'date-fns';
import type { FircResult } from '../actions';

/**
 * CLIENT-SIDE: This file is no longer used for PDF generation, which is now handled
 * by FircPdfDocument.tsx and @react-pdf/renderer in results-card.tsx.
 * This file could be repurposed or removed in the future.
 * The generateFircReport function is kept for now to avoid breaking imports,
 * but it will throw an error if called.
 */
export async function generateFircReport({
  data,
  activeTab,
}: {
  data: FircResult;
  activeTab: 'totalCost' | 'paise' | 'bps';
}) {
  throw new Error(
    'generateFircReport is deprecated. PDF generation is now handled by PDFDownloadLink in ResultsCard.'
  );
}
