'use client';
/**
 * @fileoverview ResultsCard component displays the FIRA analysis results.
 * This component is a pixel-perfect implementation of the Figma design.
 * @prop {FircResult} data - The calculated data from the FIRA document.
 * @prop {() => void} onUploadAnother - Handler to reset the form and upload a new file.
 */
import { useState } from 'react';
import type { FircResult } from '../actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// --- ICONS ---
const InfoIcon = () => (
  <svg
    width="17"
    height="21"
    viewBox="0 0 17 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16.8px] h-[20.8px]"
  >
    <path
      d="M8.39999 15C12.266 15 15.4 11.866 15.4 8C15.4 4.13401 12.266 1 8.4 1C4.53401 1 1.40002 4.13401 1.40002 8C1.40002 11.866 4.53401 15 8.39999 15Z"
      stroke="#000000"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.40039 10.5V8"
      stroke="#000000"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.40039 5.5H8.40739"
      stroke="#000000"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TooltipInfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
        <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="white" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10.4V8" stroke="white" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 5.6H8.008" stroke="white" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const UploadAnotherIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12.6667V3.33333"
      stroke="#0657D0"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 6L8 3.33333L5.33333 6"
      stroke="#0657D0"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.3333 1.33331H4.66667C3.93028 1.33331 3.33333 1.93026 3.33333 2.66665V10.6666C3.33333 11.403 3.93028 12 4.66667 12H11.3333C12.0697 12 12.6667 11.403 12.6667 10.6666V2.66665C12.6667 1.93026 12.0697 1.33331 11.3333 1.33331Z"
      stroke="#0657D0"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.66669 12V13.3333C8.66669 14.0697 8.06974 14.6667 7.33335 14.6667H2.66669C1.93029 14.6667 1.33334 14.0697 1.33334 13.3333V5.33331C1.33334 4.59692 1.93029 3.99998 2.66669 3.99998H4.00002"
      stroke="#0657D0"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- HELPERS ---
const formatNumber = (
  value: number,
  currencyCode?: string,
  decimals = 2
) => {
  if (typeof value !== 'number' || isNaN(value)) {
    if (currencyCode === 'INR') {
      return `0.00 INR`;
    }
    return currencyCode ? `${currencyCode} 0.00` : '0.00';
  }

  const options = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };
  const formatted = new Intl.NumberFormat('en-IN', options).format(
    Math.abs(value)
  );

  if (currencyCode === 'INR') {
    return `${formatted} INR`;
  }

  let prefix = '';
  if (currencyCode) {
    prefix = `${currencyCode} `;
  }

  return `${prefix}${formatted}`;
};

// --- TOOLTIP CONTENTS ---
function TooltipRow({
  label,
  value,
  valueStyles = '',
}: {
  label: string;
  value: React.ReactNode;
  valueStyles?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm self-stretch w-full">
      <span className="text-white/80 font-normal">{label}</span>
      <div className={cn('text-white flex items-center font-medium', valueStyles)}>
        <span>{value}</span>
      </div>
    </div>
  );
}

function SpreadTooltipContent({ data }: { data: FircResult }) {
  const transactionDate = format(new Date(data.transactionDate), 'dd/M/yyyy');
  return (
    <div className="flex flex-col items-start p-3 bg-[#0A1F44] rounded-lg w-[350px] gap-2 font-geist">
      <TooltipRow
        label={`MMR on ${transactionDate}`}
        value={`${formatNumber(data.midMarketRate, 'INR', 2)}`}
      />
      <TooltipRow
        label="User FX rate"
        value={`${formatNumber(data.effectiveBankRate, undefined, 2)}`}
        valueStyles="before:content-['(-)'] before:mr-1"
      />
      <div className="w-full border-b border-white/20 my-1"></div>
      <TooltipRow
        label="Effective FX spread in INR"
        value={`${formatNumber(data.spread, 'INR', 6)}`}
      />
    </div>
  );
}

function TotalCostTooltipContent({ data }: { data: FircResult }) {
  return (
    <div className="flex flex-col items-start gap-2 p-3 bg-[#0A1F44] rounded-lg w-[358px] text-sm font-geist">
      <TooltipRow
        label="FX spread in INR"
        value={`${formatNumber(data.spread, 'INR', 2)}`}
      />
      <TooltipRow
        label={`(x) ${data.foreignCurrencyCode} Amount`}
        value={`${formatNumber(
          data.foreignCurrencyAmount,
          data.foreignCurrencyCode,
          2
        )}`}
      />
      <div className="w-full border-b border-white/20 my-1"></div>
      <TooltipRow
        label="Total FX Cost"
        value={formatNumber(data.hiddenCost, 'INR')}
      />
    </div>
  );
}

function BpsTooltipContent({ data }: { data: FircResult }) {
  return (
    <div className="flex flex-col items-start p-3 bg-[#0A1F44] rounded-lg w-[350px] gap-2 font-geist">
      <TooltipRow
        label="FX spread in INR"
        value={`${formatNumber(data.spread, 'INR', 2)}`}
      />
      <TooltipRow
        label="&divide; Mid-market rate"
        value={`${formatNumber(data.midMarketRate, undefined, 2)}`}
      />
      <TooltipRow label="&times; 10,000" value="10,000" />
      <div className="w-full border-b border-white/20 my-1"></div>
      <TooltipRow
        label="Total FX Cost in bps"
        value={`${formatNumber(data.basisPoints, undefined, 5)} bps`}
      />
      <div className="w-full border-b border-white/20 my-1"></div>
      <div className="flex items-start gap-2 text-sm text-white/80 self-stretch w-full pt-1">
          <TooltipInfoIcon />
          <span>1 basis point (bps) = 0.01%. Shows exactly how much extra the bank charges.</span>
      </div>
    </div>
  );
}

interface ResultsCardProps {
  data: FircResult;
  onUploadAnother: () => void;
}

export function ResultsCard({
  data,
  onUploadAnother,
}: ResultsCardProps) {
  const [activeTab, setActiveTab] = useState('totalCost');

  const tabs = [
    { id: 'totalCost', label: 'Total Cost' },
    { id: 'paise', label: 'Paise per Unit' },
    { id: 'bps', label: 'Basis Points (bps)' },
  ];

  const handleCopy = () => {
    const resultText = `FIRC Analysis Result:
- Bank: ${data.bankName}
- Transaction Date: ${format(new Date(data.transactionDate), 'MMM dd, yyyy')}
- Total Hidden Cost: ${formatNumber(data.hiddenCost, 'INR')}
- Mid-Market Rate: ${formatNumber(data.midMarketRate, 'INR')}
- Effective FX Spread: ${formatNumber(data.spread, 'INR', 6)}
- Basis Points: ${formatNumber(data.basisPoints, undefined, 0)}
    `;
    navigator.clipboard
      .writeText(resultText)
      .then(() => {
        alert('Results copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleContactClick = () => {
    window.open(
      'https://form.jotform.com/251765324497062',
      'blank',
      'scrollbars=yes,toolbar=no,width=700,height=500'
    );
  };

  const tabContent = {
    totalCost: {
      value: `${formatNumber(data.hiddenCost, 'INR')}`,
      description: `on the mid-market rate of ${formatNumber(
        data.midMarketRate,
        'INR',
        2
      )}`,
    },
    paise: {
      value: `${formatNumber(data.spread, 'INR')}`,
      description: `on the mid-market rate of ${formatNumber(
        data.midMarketRate,
        'INR',
        2
      )}`,
    },
    bps: {
      value: `${formatNumber(data.basisPoints, undefined, 2)} bps`,
      description: `on the mid-market rate of ${formatNumber(
        data.midMarketRate,
        'INR',
        2
      )}`,
    },
  }[activeTab as keyof typeof tabContent] || { value: '', description: '' };

  return (
    <TooltipProvider>
      <div className="w-[450px] bg-[#F7FAFF] rounded-[16px] flex flex-col items-start p-6 gap-4">
        <div
          role="tablist"
          aria-label="Cost analysis tabs"
          className="w-full p-1 bg-white rounded-[6px] flex flex-row items-center self-stretch h-[48px] gap-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex flex-row justify-center items-center h-10 font-sans text-sm leading-5 font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
                activeTab === tab.id
                  ? 'bg-[#0657D0] text-white rounded-[4px]'
                  : 'bg-white text-[#64748B] hover:bg-slate-100 rounded-[4px]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="w-full border-[1.84px] border-[#E4E4E7] rounded-xl flex flex-col items-start justify-center p-3 gap-2 self-stretch"
        >
          <p className="font-semibold text-base leading-7 text-black">
            {data.bankName} has charged you
          </p>
          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold text-3xl leading-9 tracking-[-0.025em] text-black">
              {tabContent.value}
            </p>
            <p className="font-normal text-sm leading-5 text-[#0A1F44]">
              {tabContent.description}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-3 self-stretch">
          <p className="font-geist font-bold text-[16px] leading-7 align-middle">
            
            Information on FIRA
          </p>
          <div className="flex flex-col justify-center items-start gap-[6px] self-stretch">
            <DetailRow
              label="Date of transaction"
              value={format(new Date(data.transactionDate), 'MMM dd, yyyy')}
              bold={true}
            />
            <DetailRow label="Purpose code" value={data.purposeCode} bold={true} />
            <DetailRow
              label={`${data.foreignCurrencyCode} Amount`}
              value={`${formatNumber(
                data.foreignCurrencyAmount,
                data.foreignCurrencyCode
              )}`}
              bold={true}
            />
            <DetailRow
              label="User FX rate on FIRA"
              value={`${formatNumber(data.bankRate, 'INR', 2)}`}
              bold={true}
            />
            <DetailRow
              label="INR after FX"
              value={formatNumber(data.inrCredited, 'INR')}
              bold={true}
            />
          </div>
        </div>

        <hr className="w-full border-t border-[#E4E4E7]" />

        <div className="w-full flex flex-col items-start gap-3 self-stretch">
          <p className="font-geist font-bold text-[16px] leading-7 align-middle">
            Calculations
          </p>
          <div className="flex flex-col justify-center items-start gap-2 self-stretch w-full">
            <DetailRow
              label={`Mid-market Rate on ${format(
                new Date(data.transactionDate),
                'MMM dd, yyyy'
              )}`}
              value={`${formatNumber(data.midMarketRate, 'INR', 2)}`}
              bold={true}
            />
            {activeTab !== 'paise' && (
              <DetailRow
                label={
                  <span className="flex items-center gap-1.5">
                    Effective FX spread in INR
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <button
                          aria-label="More info about Effective FX spread"
                          className="flex items-center justify-center"
                        >
                          <InfoIcon />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-transparent border-none p-0 shadow-none">
                        <SpreadTooltipContent data={data} />
                      </TooltipContent>
                    </Tooltip>
                  </span>
                }
                value={`${formatNumber(data.spread, 'INR', 2)}`}
                bold={true}
              />
            )}
          </div>
        </div>

        {activeTab === 'totalCost' && (
          <div className="w-full bg-white rounded-xl py-6 px-4 flex justify-between items-center self-stretch">
            <span className="font-sans font-semibold text-sm text-black flex items-center gap-1.5">
              Effective Total Cost
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    aria-label="More info about Effective Total Cost"
                    className="flex items-center justify-center"
                  >
                    <InfoIcon />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-transparent border-none p-0 shadow-none">
                  <TotalCostTooltipContent data={data} />
                </TooltipContent>
              </Tooltip>
            </span>
            <span className="font-geist font-semibold text-xl tracking-tight text-black">
              {formatNumber(data.hiddenCost, 'INR')}
            </span>
          </div>
        )}

        {activeTab === 'paise' && (
           <div className="w-full bg-white rounded-xl p-6 flex justify-between items-center self-stretch">
             <span className="font-sans font-semibold text-sm text-black flex items-center gap-1.5">
               Effective FX spread in INR
               <Tooltip delayDuration={100}>
                 <TooltipTrigger asChild>
                   <button
                     aria-label="More info about Effective FX spread"
                     className="flex items-center justify-center"
                   >
                     <InfoIcon />
                   </button>
                 </TooltipTrigger>
                 <TooltipContent className="bg-transparent border-none p-0 shadow-none">
                   <SpreadTooltipContent data={data} />
                 </TooltipContent>
               </Tooltip>
             </span>
             <span className="font-geist font-semibold text-xl tracking-tight text-black">
               {formatNumber(data.spread, 'INR')}
             </span>
           </div>
        )}

        {activeTab === 'bps' && (
          <div className="w-full bg-white rounded-xl py-6 px-4 flex justify-between items-center self-stretch">
            <span className="font-sans font-semibold text-sm text-black flex items-center gap-1.5">
              Eff. FX spread in bps
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    aria-label="More info about BPS"
                    className="flex items-center justify-center"
                  >
                    <InfoIcon />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-transparent border-none p-0 shadow-none">
                  <BpsTooltipContent data={data} />
                </TooltipContent>
              </Tooltip>
            </span>
            <span className="font-geist font-semibold text-xl tracking-tight text-black">
              {formatNumber(data.basisPoints, undefined, 2)} bps
            </span>
          </div>
        )}

        <div className="w-full flex flex-col items-start gap-3 self-stretch">
          <p className="font-geist font-bold text-sm leading-5 text-[#1F1F1F]">
            Need better pricing that is simple & transparent?
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleContactClick();
            }}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full h-11 bg-[#0657D0] rounded-lg font-sans font-extrabold text-sm text-white hover:bg-[#0657D0]/90'
            )}
          >
            Get in Touch
          </a>
          <div className="w-full flex justify-between items-center">
            <button
              onClick={handleCopy}
              className="group flex items-center gap-1.5 text-[#0657D0] font-sans font-normal text-sm leading-5"
            >
              <CopyIcon />
              <span className="relative py-1 font-bold">
                Copy Result
                <span className="absolute bottom-0 left-0 block h-[1px] w-0 bg-[#0657D0] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
            <button
              className="group flex items-center gap-1.5 text-[#0657D0] font-sans font-normal text-sm leading-5 hover:bg-transparent"
              onClick={onUploadAnother}
            >
              <UploadAnotherIcon />
              <span className="relative py-1 font-bold">
                Upload Another FIRA
                <span className="absolute bottom-0 left-0 block h-[1px] w-0 bg-[#0657D0] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function DetailRow({
  label,
  value,
  bold = false,
}: {
  label: string | React.ReactNode;
  value: string | React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1 gap-1 w-full h-7">
      <div
        className={cn(
          'font-geist text-sm leading-5 text-[#0F172A] flex items-center font-normal'
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          'font-geist text-sm leading-5 text-[#0F172A] text-right',
          bold ? 'font-bold' : 'font-medium'
        )}
      >
        {value}
      </div>
    </div>
  );
}
