'use client';
/**
 * @fileoverview ResultsCard component displays the FIRA analysis results based on Figma spec.
 * @prop {FircResult} data - The calculated data from the FIRA document.
 * @prop {() => void} onUploadAnother - Handler to reset the form and upload a new file.
 * @prop {() => void} onContactClick - Handler for the "Get in Touch" button.
 */
import { useState } from 'react';
import type { FircResult } from '../actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ResultsCardProps {
  data: FircResult;
  onUploadAnother: () => void;
  onContactClick: () => void;
}

// Figma Frame: Part of 1000004943 - Bank Icon
const BankIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 21C11 21 19 14.2 19 8.5C19 4.36 15.42 1 11 1C6.58 1 3 4.36 3 8.5C3 14.2 11 21 11 21Z" stroke="#0A1F44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 8.5C14 10.16 12.66 11.5 11 11.5C9.34 11.5 8 10.16 8 8.5C8 6.84 9.34 5.5 11 5.5C12.66 5.5 14 6.84 14 8.5Z" stroke="#0A1F44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <path d="M10 4L8 2L6 4" stroke="#145AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 2V10" stroke="#145AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 7V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V7" stroke="#145AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const formatNumber = (value: number, currency?: 'INR', decimals = 2) => {
    const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
    return currency ? `${formatted} ${currency}` : formatted;
};

export function ResultsCard({ data, onUploadAnother, onContactClick }: ResultsCardProps) {
  const [activeTab, setActiveTab] = useState('totalCost');

  const tabs = [
    { id: 'totalCost', label: 'Total Cost' },
    { id: 'paise', label: 'Paise per Unit' },
    { id: 'bps', label: 'Basis Points (bps)' },
  ];

  const tabContent = {
    totalCost: {
        value: formatNumber(data.hiddenCost, 'INR'),
        description: `on the mid-market rate of INR ${formatNumber(data.midMarketRate)}`
    },
    paise: {
        value: formatNumber(data.paisePerUnit) + ' Paise',
        description: 'Paise lost per foreign currency unit'
    },
    bps: {
        value: formatNumber(data.basisPoints),
        description: 'Basis Points (bps) Markup'
    }
  }[activeTab as keyof typeof tabContent] || { value: '', description: '' };


  return (
    // Figma Frame: 1000005259 - Main Container
    <div className="w-[450px] bg-white border border-[#F0F0F0] rounded-[16px] p-[24px_16px] flex flex-col gap-[16px] animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      
      {/* Figma Frame: 1272637978 - Tabs */}
      <div role="tablist" aria-label="Cost analysis tabs" className="flex flex-row items-start p-1 gap-4 w-[418px] h-[40px] bg-[#F1F5F9] rounded-[6px] self-stretch">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center py-[6px] px-[12px] h-[32px] rounded-[4px] font-sans text-[14px] leading-[20px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#145AFF]',
              activeTab === tab.id
                ? 'bg-white text-[#0A1F44] shadow-sm'
                : 'bg-transparent text-[#6A7280] hover:bg-white/50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Figma Frame: 1000004943 - Bank Charge Header */}
      <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="flex flex-col items-center p-[16px_12px] gap-[11.05px] w-[418px] border-[1.84091px] border-[#EEF3F7] rounded-[12px]">
        <div className="flex items-center gap-2 font-sans text-[#0A1F44] text-[16px] leading-[18px] font-semibold">
            <BankIcon />
            {data.bankName} charged you
        </div>
        <p className="font-sans text-[28px] leading-[32px] font-bold text-[#000000]">
            {tabContent.value}
        </p>
        <p className="font-sans text-[14px] leading-[16px] text-[#0A1F44]">
            {tabContent.description}
        </p>
      </div>

      {/* Figma Frame: 1000005242 & 1000005243 - Analysis Breakdown */}
      <div className="flex flex-col w-[418px] gap-[12px]">
        {/* Information on FIRA */}
        <div className='flex flex-col gap-2'>
            <h3 className="font-sans text-[16px] font-semibold text-[#1F1F1F]">Information on FIRA</h3>
            <DetailRow label="Date of transaction" value={format(new Date(data.transactionDate), 'MMM dd, yyyy')} />
            <DetailRow label="Purpose code" value={data.purposeCode} />
            <DetailRow label="USD Amount" value={`${formatNumber(data.foreignCurrencyAmount)} USD`} />
            <DetailRow label="User FX rate on FIRA" value={`${formatNumber(data.bankRate)} INR`} />
            <DetailRow label="INR after FX" value={formatNumber(data.inrCredited, 'INR')} />
        </div>

        <hr className="border-t border-[#F0F0F0]" />

        {/* Calculations */}
        <div className='flex flex-col gap-2'>
            <h3 className="font-sans text-[16px] font-semibold text-[#1F1F1F]">Calculations</h3>
            <DetailRow label={`Mid-market Rate on ${format(new Date(data.transactionDate), 'MMM dd, yyyy')}`} value={`${formatNumber(data.midMarketRate)} INR`} />
            <DetailRow 
                label="Effective FX spread in INR" 
                value={
                    <span className="flex items-center gap-1.5">
                        {`${formatNumber(data.spread)} INR`}
                        <InfoIcon className="text-gray-400" />
                    </span>
                } 
            />
        </div>

        {/* Effective Total Cost Panel */}
        <div className="bg-[#F5F8FF] rounded-[12px] p-[24px_16px] flex justify-between items-center w-[418px] h-[68.8px]">
            <span className="font-sans text-[16px] leading-[18px] font-medium text-black">Effective Total Cost</span>
            <span className="flex items-center gap-2 font-sans text-[16px] leading-[18px] font-medium text-black">
                {formatNumber(data.hiddenCost, 'INR')}
                <InfoIcon className="text-gray-400" />
            </span>
        </div>
      </div>


      {/* CTA Buttons & Footer */}
      <div className="flex flex-col items-center gap-6 mt-2">
        <p className="font-sans text-base font-semibold text-center text-[#0A1F44]">
          Need better pricing that is simple & transparent?
        </p>
        <Button size="lg" className="w-full bg-[#145AFF] text-white font-semibold text-[14px] leading-[16px] rounded-[8px] py-[12px] px-[16px] h-auto hover:bg-[#145AFF]/90" onClick={onContactClick}>
            Get in Touch
        </Button>
        <button onClick={onUploadAnother} className="flex items-center gap-2 font-sans text-[14px] leading-[20px] text-[#145AFF] font-normal">
            <UploadIcon />
            Upload Another FIRA
        </button>
        <footer className="text-center text-xs text-[#1F1F1F] mt-2 font-sans">
          Powered by Karbon & Google Gemini.
        </footer>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | React.ReactNode }) {
    return (
      <div className="flex justify-between items-center py-1 gap-4 w-full h-[28px]">
        <p className="font-sans text-[14px] leading-[20px] font-medium text-[#6A7280]">{label}</p>
        <div className="font-sans text-[14px] leading-[20px] font-medium text-[#1F1F1F] text-right">{value}</div>
      </div>
    );
}
