'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingCard() {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center p-[32px_24px] gap-[24px] w-[450px] h-[749px] bg-white border border-[#F0F0F0] rounded-[16px]'
      )}
    >
      <div
        role="status"
        className="flex flex-col justify-center items-center gap-[12px] w-[204px] h-[204px] rounded-[16.32px]"
      >
        <Loader2 className="w-[48.96px] h-[48.96px] animate-spin text-[#145AFF]" />
        <p className="font-sans font-medium text-[24px] leading-[28px] text-center tracking-[-0.24px] text-[#145AFF]">
          Extracting data...
        </p>
        <span className="sr-only">Extracting data...</span>
      </div>
    </div>
  );
}
