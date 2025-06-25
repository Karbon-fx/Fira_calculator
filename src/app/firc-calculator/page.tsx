'use client';

import { useState } from 'react';
import { UploadForm } from './components/upload-form';
import { ResultsCard } from './components/results-card';
import { LoadingCard } from './components/loading-card';
import type { FircResult } from './actions';


export default function FircCalculatorPage() {
  const [resultData, setResultData] = useState<FircResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleUploadComplete = (data: FircResult) => {
    setResultData(data);
    setIsProcessing(false);
  };

  const handleUploadAnother = () => {
    setResultData(null);
  };

  const handleContactClick = () => {
    // Placeholder for "Get in Touch" logic
    alert('Get in Touch clicked!');
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#E9F2FB] p-4 sm:p-6 md:p-8">
      <main className="flex items-center justify-center">
        {isProcessing ? (
          <LoadingCard />
        ) : resultData ? (
          <ResultsCard 
              data={resultData} 
              onUploadAnother={handleUploadAnother}
              onContactClick={handleContactClick}
          />
        ) : (
          <UploadForm onComplete={handleUploadComplete} onProcessingChange={setIsProcessing} />
        )}
      </main>
    </div>
  );
}
