'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import type { FircResult } from '../actions';
import { Info, Repeat, Handshake } from 'lucide-react';

interface ResultsCardProps {
  data: FircResult;
  onReset: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatNumber = (value: number, precision = 2) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
  
const formatCurrencyPrecise = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);

export function ResultsCard({ data, onReset }: ResultsCardProps) {
  return (
    <Card className="w-full animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <CardHeader className="text-center">
        <CardDescription className="font-medium">
          On the mid-market rate of {formatCurrencyPrecise(data.midMarketRate)}, your bank charged you:
        </CardDescription>
        <CardTitle className="text-2xl font-headline text-destructive md:text-3xl">
          {formatCurrency(data.totalCost)} extra
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="totalCost" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="totalCost">Total Cost</TabsTrigger>
            <TabsTrigger value="paise">Paise/Unit</TabsTrigger>
            <TabsTrigger value="bps">Basis Points</TabsTrigger>
          </TabsList>
          <TabsContent value="totalCost" className="pt-6 text-center">
            <p className="text-5xl font-bold text-primary">{formatCurrency(data.totalCost)}</p>
            <p className="text-muted-foreground">Total hidden FX charges</p>
          </TabsContent>
          <TabsContent value="paise" className="pt-6 text-center">
            <p className="text-5xl font-bold text-primary">{formatNumber(data.paisePerUnit, 2)}</p>
            <p className="text-muted-foreground">Paise lost per foreign currency unit</p>
          </TabsContent>
          <TabsContent value="bps" className="pt-6 text-center">
            <p className="text-5xl font-bold text-primary">{formatNumber(data.basisPoints)}</p>
            <p className="text-muted-foreground">Basis Points (bps) Markup</p>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Info className="text-primary" />
            Analysis Breakdown
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Information from FIRA</h4>
              <DetailRow label="Transaction Date" value={data.transactionDate} />
              <DetailRow label="Purpose Code" value={data.purposeCode} />
              <DetailRow label="Foreign Amount" value={`$${formatNumber(data.foreignCurrencyAmount)}`} />
              <DetailRow label="Bank's Quoted Rate" value={formatCurrencyPrecise(data.bankFxRateOnFira)} />
              <DetailRow label="INR Credited" value={formatCurrency(data.inrCredited)} />
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Calculations</h4>
              <DetailRow label="Mid-Market Rate" value={formatCurrencyPrecise(data.midMarketRate)} />
              <DetailRow label="Your Effective Rate" value={formatCurrencyPrecise(data.effectiveBankRate)} />
              <DetailRow label="Per-Unit Spread" value={formatCurrencyPrecise(data.spread)} />
              <DetailRow label="Total FX Cost" value={formatCurrency(data.totalCost)} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2 pt-6 md:grid-cols-2">
        <Button size="lg" className="bg-accent hover:bg-accent/90">
          <Handshake />
          Get in Touch
        </Button>
        <Button size="lg" variant="outline" onClick={onReset}>
          <Repeat />
          Upload Another FIRA
        </Button>
      </CardFooter>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
