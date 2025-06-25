'use client';
/**
 * @fileoverview ResultsCard component displays the FIRA analysis results.
 * @prop {FircResult} data - The calculated data from the FIRA document.
 * @prop {() => void} onReset - Handler to reset the form and upload a new file.
 * @prop {() => void} onGetInTouch - Handler for the "Get in Touch" button.
 * @prop {() => void} onCopyLink - Handler for the "Copy Links" button.
 */
import { useState } from 'react';
import type { FircResult } from '../actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Copy, Upload } from 'lucide-react';

interface ResultsCardProps {
  data: FircResult;
  onReset: () => void;
  onGetInTouch: () => void;
  onCopyLink: () => void;
}

const BankIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M12 2L2 12L12 22L22 12L12 2Z"
      fill="hsl(var(--destructive))"
    />
    <path
      d="M15 9L9 15"
      stroke="hsl(var(--destructive-foreground))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9L15 15"
      stroke="hsl(var(--destructive-foreground))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 5.5H8.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const formatValue = (value: number, type: 'currency' | 'number', digits = 2) => {
    if (type === 'currency') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        }).format(value);
    }
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

export function ResultsCard({ data, onReset, onGetInTouch, onCopyLink }: ResultsCardProps) {
  const [activeTab, setActiveTab] = useState('totalCost');
  const tabs = [
    { id: 'totalCost', label: 'Total Cost' },
    { id: 'paise', label: 'Paise' },
    { id: 'bps', label: 'Basis Points(bps)' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
        case 'totalCost':
            return {
                value: formatValue(data.totalCost, 'currency'),
                label: 'Total hidden FX charges'
            };
        case 'paise':
            return {
                value: formatValue(data.paisePerUnit, 'number'),
                label: 'Paise lost per foreign currency unit'
            };
        case 'bps':
            return {
                value: formatValue(data.basisPoints, 'number'),
                label: 'Basis Points (bps) Markup'
            };
        default:
            return { value: '', label: '' };
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card rounded-2xl p-6 sm:p-8 shadow-card-shadow animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <div className="bg-muted rounded-lg p-1 flex items-center space-x-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 text-center font-semibold text-sm sm:text-base py-2 px-2 sm:px-4 rounded-lg transition-colors',
              activeTab === tab.id
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-card/50'
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card text-center mb-6">
        <div className="bg-destructive/10 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-destructive text-sm font-semibold mb-1">
                <BankIcon />
                {data.bankName} charged you
            </div>
            <p className="text-4xl font-bold text-foreground">
                {formatValue(data.totalCost, 'currency')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                on the mid-market rate of INR {formatValue(data.midMarketRate, 'number', 2)}
            </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Information on FIRA</h3>
        <div className="space-y-3 text-sm">
            <DetailRow label="Date of transaction" value={format(new Date(data.transactionDate), 'MMM dd, yyyy')} />
            <DetailRow label="Purpose code" value={data.purposeCode} />
            <DetailRow label="USD Amount" value={`${formatValue(data.foreignCurrencyAmount, 'number')} USD`} />
            <DetailRow label="User FX rate on FIRA" value={`${formatValue(data.bankFxRateOnFira, 'number')} INR`} />
            <DetailRow label="INR after FX" value={`${formatValue(data.inrCredited, 'number')} INR`} />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Calculations</h3>
        <div className="space-y-3 text-sm">
            <DetailRow label={`Mid-market Rate on ${format(new Date(data.transactionDate), 'MMM dd, yyyy')}`} value={`${formatValue(data.midMarketRate, 'number')} INR`} />
            <DetailRow 
                label="Effective FX spread in INR" 
                value={
                    <span className="flex items-center gap-1.5">
                        {`${formatValue(data.spread, 'number')} INR`}
                        <InfoIcon className="text-muted-foreground" />
                    </span>
                } 
            />
            <div className="bg-muted/80 rounded-lg p-3 flex justify-between items-center font-medium">
                <p>Effective Total Cost</p>
                <p className="flex items-center gap-1.5">
                    {formatValue(data.totalCost, 'currency')}
                    <InfoIcon className="text-muted-foreground" />
                </p>
            </div>
        </div>
      </div>

      <div className="text-center">
        <p className="font-semibold text-foreground mb-4">Need better pricing that is simple & transparent?</p>
        <Button size="lg" className="w-full sm:w-auto" onClick={onGetInTouch}>
            Get in Touch
        </Button>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <button onClick={onCopyLink} className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <Copy size={16}/> Copy Links
        </button>
        <button onClick={onReset} className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <Upload size={16} /> Upload Another FIRA
        </button>
      </div>
      <footer className="mt-6 text-center text-xs text-muted-foreground">
          <p>Powered by Karbon & Google Gemini.</p>
      </footer>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | React.ReactNode }) {
    return (
      <div className="flex justify-between items-center text-sm">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground text-right">{value}</p>
      </div>
    );
  }
