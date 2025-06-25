'use client';
/**
 * @fileoverview ResultsCard component displays the FIRA analysis results.
 * This component is a pixel-perfect implementation of the Figma design.
 * @prop {FircResult} data - The calculated data from the FIRA document.
 * @prop {() => void} onUploadAnother - Handler to reset the form and upload a new file.
 * @prop {() => void} onContactClick - Handler for the "Get in Touch" button.
 */
import { useState } from 'react';
import type { FircResult } from '../actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// --- ICONS ---
// Figma Frame: Vector (Info Icon)
const InfoIcon = () => (
  <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.39999 15C12.266 15 15.4 11.866 15.4 8C15.4 4.13401 12.266 1 8.4 1C4.53401 1 1.40002 4.13401 1.40002 8C1.40002 11.866 4.53401 15 8.39999 15Z" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.40039 10.5V8" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.40039 5.5H8.40739" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Figma Frame: Upload (Upload Icon)
const UploadAnotherIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12.6667V3.33333" stroke="#145AFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6667 6L8 3.33333L5.33333 6" stroke="#145AFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Figma Frame: Copy (Copy Icon)
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 1.33331H4.66667C3.93028 1.33331 3.33333 1.93026 3.33333 2.66665V10.6666C3.33333 11.403 3.93028 12 4.66667 12H11.3333C12.0697 12 12.6667 11.403 12.6667 10.6666V2.66665C12.6667 1.93026 12.0697 1.33331 11.3333 1.33331Z" stroke="#145AFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.66669 12V13.3333C8.66669 14.0697 8.06974 14.6667 7.33335 14.6667H2.66669C1.93029 14.6667 1.33334 14.0697 1.33334 13.3333V5.33331C1.33334 4.59692 1.93029 3.99998 2.66669 3.99998H4.00002" stroke="#145AFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


// --- HELPERS ---
const formatNumber = (value: number, currency?: 'INR' | 'USD', decimals = 2) => {
  const options = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };
  const formatted = new Intl.NumberFormat('en-IN', options).format(Math.abs(value));

  if (currency === 'INR') {
    return `₹${formatted}`;
  }
  if (currency === 'USD') {
    return `$${formatted}`
  }
  return formatted;
};

// --- TOOLTIP CONTENTS ---
function TooltipRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-sm self-stretch w-full font-sans">
      <span className="text-white/80">{label}</span>
      <div className="text-white flex items-center">
        <span>{value}</span>
      </div>
    </div>
  );
}

function SpreadTooltipContent({ data }: { data: FircResult }) {
    const transactionDate = format(new Date(data.transactionDate), 'dd/M/yyyy');
    return (
      <div className="flex flex-col items-start p-3 bg-[#0A1F44] rounded-lg w-[350px] gap-2">
        <TooltipRow label={`MMR on ${transactionDate}`} value={`${formatNumber(data.midMarketRate, undefined, 2)} INR`} />
        <TooltipRow label="User FX rate" value={`(-)${formatNumber(data.effectiveBankRate, undefined, 2)}`} />
        <div className="w-full border-b border-white/20 my-1"></div>
        <TooltipRow label="Effective FX spread in INR" value={`${formatNumber(data.spread, undefined, 6)} INR`} />
      </div>
    );
  }

function TotalCostTooltipContent({ data }: { data: FircResult }) {
  return (
    <div className="flex flex-col items-start gap-2 p-3 bg-[#0A1F44] rounded-lg w-[358px] text-sm">
      <TooltipRow label="FX spread in INR" value={`${formatNumber(data.spread, undefined, 2)} INR`} />
      <TooltipRow label="&times; USD Amount" value={`${formatNumber(data.foreignCurrencyAmount, undefined, 2)} USD`} />
      <div className="w-full border-b border-white/20 my-1"></div>
      <TooltipRow label="Total FX Cost" value={formatNumber(data.hiddenCost, 'INR')} />
    </div>
  );
}

interface ResultsCardProps {
  data: FircResult;
  onUploadAnother: () => void;
  onContactClick: () => void;
}

export function ResultsCard({ data, onUploadAnother, onContactClick }: ResultsCardProps) {
  const [activeTab, setActiveTab] = useState('totalCost');

  const tabs = [
    { id: 'totalCost', label: 'Total Cost' },
    { id: 'paise', label: 'Paise' },
    { id: 'bps', label: 'Basis Points(bps)' },
  ];

  const handleCopy = () => {
    const resultText = `FIRC Analysis Result:
- Bank: ${data.bankName}
- Transaction Date: ${format(new Date(data.transactionDate), 'MMM dd, yyyy')}
- Total Hidden Cost: ${formatNumber(data.hiddenCost, 'INR')}
- Mid-Market Rate: ${formatNumber(data.midMarketRate, undefined)} INR
- Effective FX Spread: ${formatNumber(data.spread, undefined, 6)} INR
- Basis Points: ${formatNumber(data.basisPoints, undefined, 0)}
    `;
    navigator.clipboard.writeText(resultText).then(() => {
      alert('Results copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const tabContent = {
    totalCost: {
      value: `${formatNumber(data.hiddenCost, 'INR')}`,
      description: `on the mid-market rate of INR ${formatNumber(data.midMarketRate, undefined, 2)}`
    },
    paise: {
      value: `${formatNumber(data.paisePerUnit)} Paise`,
      description: 'Paise lost per foreign currency unit'
    },
    bps: {
      value: `${formatNumber(data.basisPoints, undefined, 0)} bps`,
      description: 'Basis Points (bps) Markup'
    }
  }[activeTab as keyof typeof tabContent] || { value: '', description: '' };


  return (
    <TooltipProvider>
      {/* Frame 1000005238 */}
      <div className="w-[450px] h-auto bg-white border border-[#F0F0F0] rounded-[16px] flex flex-col items-start p-[24px_16px] gap-4">

        {/* Frame 1272637979 -> Tabs */}
        <div role="tablist" aria-label="Cost analysis tabs" className="w-[418px] h-10 p-1 bg-[#F1F5F9] rounded-[6px] flex flex-row items-center self-stretch gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex flex-row justify-center items-center py-[6px] px-3 gap-2.5 h-8 rounded-[4px] font-sans font-medium text-sm leading-5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
                activeTab === tab.id ? 'bg-white text-[#0A1F44] shadow-sm' : 'bg-transparent text-[#6A7280] hover:bg-white/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Frame 1000004943 - Bank Charge Header */}
        <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="w-[418px] h-auto border-[1.84091px] border-[#EEF3F7] rounded-[12px] flex flex-row justify-between items-center p-[16px_12px] gap-[11.05px] self-stretch">
          <div className="flex flex-col items-start gap-2 flex-1">
            <div className="flex flex-row items-center gap-2 self-stretch">
              <p className="font-sans font-semibold text-base leading-[18px] text-[#0A1F44] tracking-[-0.16px]">
                {data.bankName} charged you
              </p>
            </div>
            <p className="font-sans font-bold text-[28px] leading-8 tracking-[-0.56px] text-black">
              {tabContent.value}
            </p>
            <p className="font-sans font-normal text-sm leading-4 tracking-[-0.14px] text-[#0A1F44] self-stretch">
              {tabContent.description}
            </p>
          </div>
        </div>

        {/* Frame 1000005242 - Analysis Breakdown */}
        <div className="w-[418px] flex flex-col items-start gap-3 self-stretch">
          <p className="font-sans font-medium text-sm leading-5 text-[#1F1F1F]">Information on FIRA</p>
          <div className="flex flex-col justify-center items-start gap-1.5 self-stretch">
            <DetailRow label="Date of transaction" value={format(new Date(data.transactionDate), 'MMM dd, yyyy')} />
            <DetailRow label="Purpose code" value={data.purposeCode} />
            <DetailRow label="USD Amount" value={`${formatNumber(data.foreignCurrencyAmount, 'USD')}`} />
            <DetailRow label="User FX rate on FIRA" value={`${formatNumber(data.bankRate, undefined)} INR`} />
            <DetailRow label="INR after FX" value={formatNumber(data.inrCredited, 'INR')} />
          </div>
        </div>

        {/* Line 19 */}
        <hr className="w-full border-t border-[#F0F0F0]" />

        {/* Calculations section */}
        <div className="w-[418px] flex flex-col items-start gap-3 self-stretch">
          <p className="font-sans font-medium text-sm leading-5 text-[#1F1F1F]">Calculations</p>
          <div className="flex flex-col justify-center items-start gap-1.5 self-stretch">
            <DetailRow label={`Mid-market Rate on ${format(new Date(data.transactionDate), 'MMM dd, yyyy')}`} value={`${formatNumber(data.midMarketRate, undefined)} INR`} />
            <DetailRow
              label="Effective FX spread in INR"
              value={
                <span className="flex items-center gap-1.5">
                  {`${formatNumber(data.spread, undefined, 6)}`}
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button aria-label="More info about Effective FX spread" className="flex items-center justify-center">
                        <InfoIcon />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-transparent border-none p-0 shadow-none">
                      <SpreadTooltipContent data={data} />
                    </TooltipContent>
                  </Tooltip>
                </span>
              }
            />
          </div>
        </div>

        {/* Frame 1000004943 - Effective Total Cost Panel */}
        <div className="w-[418px] h-auto bg-[#F5F8FF] rounded-[12px] p-[24px_16px] flex flex-row justify-between items-center self-stretch">
          <span className="font-sans font-medium text-base leading-[18px] text-black tracking-[-0.16px]">Effective Total Cost</span>
          <span className="flex items-center gap-1.5 font-sans font-medium text-base leading-[18px] text-black tracking-[-0.16px]">
            {formatNumber(data.hiddenCost, 'INR')}
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button aria-label="More info about Effective Total Cost" className="flex items-center justify-center">
                  <InfoIcon />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-transparent border-none p-0 shadow-none">
                <TotalCostTooltipContent data={data} />
              </TooltipContent>
            </Tooltip>
          </span>
        </div>

        {/* Frame 1272637998 - CTA and Footer */}
        <div className="w-[418px] flex flex-col items-start gap-3 self-stretch">
          <p className="font-sans font-medium text-base leading-[18px] tracking-[-0.16px] text-[#1F1F1F]">
            Need better pricing that is simple & transparent?
          </p>
          <Button className="w-full h-10 bg-[#145AFF] rounded-lg py-3 px-4 font-sans font-semibold text-sm leading-4 text-white hover:bg-[#145AFF]/90" onClick={onContactClick}>
            Get in Touch
          </Button>
          <div className="w-full flex justify-between items-center">
            <button onClick={handleCopy} className="group flex items-center gap-1.5 text-[#145AFF] font-sans font-normal text-sm leading-5">
              <CopyIcon />
              <span className="relative py-1">
                Copy Result
                <span className="absolute bottom-0 left-0 block h-[1px] w-0 bg-[#145AFF] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
            <button className="group flex items-center gap-1.5 text-[#145AFF] font-sans font-normal text-sm leading-5" onClick={onUploadAnother}>
              <UploadAnotherIcon />
              <span className="relative py-1">
                Upload Another FIRA
                <span className="absolute bottom-0 left-0 block h-[1px] w-0 bg-[#145AFF] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function DetailRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className='flex justify-between items-center py-1 gap-1 w-full h-7'>
      <p className="font-sans font-normal text-sm leading-5 text-[#6A7280]">{label}</p>
      <div className="font-sans font-medium text-sm leading-5 text-[#1F1F1F] text-right">{value}</div>
    </div>
  );
}
