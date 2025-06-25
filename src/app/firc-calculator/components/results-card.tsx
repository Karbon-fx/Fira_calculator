'use client';
/**
 * @fileoverview ResultsCard component displays the FIRA analysis results.
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

interface ResultsCardProps {
  data: FircResult;
  onUploadAnother: () => void;
  onContactClick: () => void;
}

// Figma Frame: Red Cross Icon
const CrossIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#FEE2E2"/>
        <path d="M15 9L9 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// Figma Frame: Part of 1000005243 - Info Icon
const InfoIcon = ({ className }: { className?: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 5.5H8.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Icon for Upload Another FIRA button
const UploadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4L8 2L6 4" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 2V10" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 7V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V7" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3333 10H12.6666C13.5833 10 14 9.5833 14 8.66664V3.3333C14 2.41664 13.5833 2 12.6666 2H7.33327C6.41661 2 5.99994 2.41664 5.99994 3.3333V4.66664" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14H3.33333C2.41667 14 2 13.5833 2 12.6667V6H7.33333C8.25 6 8.66667 6.41667 8.66667 7.33333V12.6667C8.66667 13.5833 8.25 14 7.33333 14" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const formatNumber = (value: number, currency?: 'INR' | 'USD', decimals = 2) => {
    const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(Math.abs(value));
    return currency ? `${formatted} ${currency}` : formatted;
};

function TooltipRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/80">{label}</span>
      <div className="font-mono text-white flex items-center">
        <span>{value}</span>
      </div>
    </div>
  );
}

function SpreadTooltipContent({ data }: { data: FircResult }) {
    const transactionDate = format(new Date(data.transactionDate), 'dd/M/yyyy');
    return (
        <div className="flex flex-col gap-1.5 font-sans">
            <TooltipRow label={`MMR on ${transactionDate}`} value={`${formatNumber(data.midMarketRate, 'INR')}`} />
            <TooltipRow label="User FX rate" value={<span>&ndash;{formatNumber(data.effectiveBankRate, 'INR')}</span>} />
            <hr className="my-1 border-white/20" />
            <TooltipRow label="Effective FX spread" value={`${formatNumber(data.spread, 'INR', 6)}`} />
        </div>
    );
}

function TotalCostTooltipContent({ data }: { data: FircResult }) {
    return (
        <div className="flex flex-col gap-1.5 font-sans">
            <TooltipRow label="FX spread in INR" value={`${formatNumber(data.spread, 'INR')}`} />
            <TooltipRow label="USD Amount" value={<span>&times; {formatNumber(data.foreignCurrencyAmount, 'USD')}</span>} />
            <hr className="my-1 border-white/20" />
            <TooltipRow label="Total FX Cost" value={`${formatNumber(data.hiddenCost, 'INR')}`} />
        </div>
    );
}

export function ResultsCard({ data, onUploadAnother, onContactClick }: ResultsCardProps) {
  const [activeTab, setActiveTab] = useState('totalCost');

  const tabs = [
    { id: 'totalCost', label: 'Total Cost' },
    { id: 'paise', label: 'Paise' },
    { id: 'bps', label: 'Basis Points(bps)' },
  ];

  const tabContent = {
    totalCost: {
        value: formatNumber(data.hiddenCost),
        description: `on the mid-market rate of INR ${formatNumber(data.midMarketRate)}`
    },
    paise: {
        value: formatNumber(data.paisePerUnit),
        description: 'Paise lost per foreign currency unit'
    },
    bps: {
        value: formatNumber(data.basisPoints),
        description: 'Basis Points (bps) Markup'
    }
  }[activeTab as keyof typeof tabContent] || { value: '', description: '' };


  return (
    <TooltipProvider>
    <div className="w-full max-w-xl mx-auto bg-white border border-[#F0F0F0] rounded-2xl p-8 flex flex-col gap-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      
      {/* Figma Frame: Tabs */}
      <div role="tablist" aria-label="Cost analysis tabs" className="flex items-start p-1 gap-2 bg-[#F3F6F8] rounded-lg self-stretch">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center py-2 px-4 rounded-lg font-semibold text-base leading-6 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3C82F6]',
              activeTab === tab.id
                ? 'bg-white text-[#1F2937] border-b-2 border-[#3C82F6]'
                : 'bg-transparent text-[#6B7280] hover:bg-white/50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Figma Frame: Bank Charge Header */}
      <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="flex flex-col items-start gap-1 w-full">
        <div className="flex items-center gap-2 font-sans text-[#4B5563] text-base leading-6 font-semibold">
            <CrossIcon />
            {data.bankName} charged you
        </div>
        <p className="font-sans text-2xl leading-8 font-bold text-[#EF4444] ml-8">
            {formatNumber(data.hiddenCost, 'INR')} extra
        </p>
        <p className="font-sans text-4xl leading-10 font-bold text-[#1E40AF]">
            {formatNumber(data.hiddenCost, 'INR')} Total hidden FX charges
        </p>
        <p className="font-sans text-base leading-6 text-[#4B5563] mt-1">
            {tabContent.description}
        </p>
      </div>

      {/* Figma Frame: Analysis Breakdown */}
      <div className="w-full bg-[#F9FAFB] rounded-lg p-6">
        {/* Information on FIRA */}
        <div className='flex flex-col gap-4'>
            <h3 className="font-sans text-lg font-semibold text-[#1F2937]">Information on FIRA</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <DetailRow label="Date of transaction" value={format(new Date(data.transactionDate), 'MMM dd, yyyy')} />
                <DetailRow label="Purpose code" value={data.purposeCode} />
                <DetailRow label="USD Amount" value={`${formatNumber(data.foreignCurrencyAmount, 'USD')}`} />
                <DetailRow label="User FX rate on FIRA" value={`${formatNumber(data.bankRate)} INR`} />
                <DetailRow label="INR after FX" value={formatNumber(data.inrCredited, 'INR')} />
            </div>
        </div>

        <hr className="border-t border-[#E5E7EB] my-4" />

        {/* Calculations */}
        <div className='flex flex-col gap-4'>
            <h3 className="font-sans text-lg font-semibold text-[#1F2937]">Calculations</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <DetailRow label={`Mid-market Rate on ${format(new Date(data.transactionDate), 'MMM dd, yyyy')}`} value={`${formatNumber(data.midMarketRate)} INR`} />
                 <DetailRow 
                    label="Effective FX spread in INR" 
                    value={
                        <span className="flex items-center gap-1.5">
                            {`${formatNumber(data.spread)} INR`}
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <button aria-label="More info about Effective FX spread" className="flex items-center justify-center">
                                        <InfoIcon className="text-[#6B7280] cursor-pointer" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#0A1F44] text-white border-none rounded-lg p-4 max-w-xs shadow-lg font-sans leading-5">
                                    <SpreadTooltipContent data={data} />
                                </TooltipContent>
                            </Tooltip>
                        </span>
                    } 
                />
            </div>
        </div>
      </div>

      {/* Effective Total Cost Panel */}
       <div className="bg-[#F9FAFB] rounded-lg p-6 flex justify-between items-center w-full">
            <span className="font-sans text-lg font-semibold text-[#1F2937]">Effective Total Cost</span>
            <span className="flex items-center gap-2 font-sans text-lg font-medium text-[#111827]">
                {formatNumber(data.hiddenCost, 'INR')}
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                         <button aria-label="More info about Effective Total Cost" className="flex items-center justify-center">
                            <InfoIcon className="text-[#6B7280] cursor-pointer" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0A1F44] text-white border-none rounded-lg p-4 max-w-xs shadow-lg font-sans leading-5">
                       <TotalCostTooltipContent data={data} />
                    </TooltipContent>
                </Tooltip>
            </span>
        </div>


      {/* CTA Buttons & Footer */}
      <div className="flex flex-col items-center gap-4 mt-2 w-full">
        <p className="font-sans text-base font-semibold text-center text-[#111827]">
          Need better pricing that is simple & transparent?
        </p>
        <div className="flex w-full gap-4">
            <Button size="lg" className="flex-1 bg-[#7C3AED] text-white font-medium rounded-lg py-3 px-6 shadow-sm hover:bg-[#6B21A8] text-base" onClick={onContactClick}>
                Get in Touch
            </Button>
            <Button size="lg" variant="outline" className="flex-1 border-[#E5E7EB] text-[#1F2937] font-medium rounded-lg py-3 px-6 hover:bg-[#F3F4F6] text-base" onClick={onUploadAnother}>
                <UploadIcon />
                Upload Another FIRA
            </Button>
        </div>
         <button className="flex items-center gap-2 font-sans text-sm font-medium text-[#1F2937]">
            <CopyIcon />
            Copy Link
        </button>
        <footer className="text-center text-xs text-[#6B7280] mt-6 font-sans">
          Powered by Karbon & Google Gemini.
        </footer>
      </div>
    </div>
    </TooltipProvider>
  );
}

function DetailRow({ label, value }: { label: string; value: string | React.ReactNode }) {
    return (
      <>
        <p className="font-sans text-sm font-medium text-[#6B7280]">{label}</p>
        <div className="font-sans text-sm text-[#111827] text-right">{value}</div>
      </>
    );
}
