// Version 3.0
'use client';

import { useState, useRef } from 'react';
import { UploadForm } from './components/upload-form';
import { ResultsCard } from './components/results-card';
import { LoadingCard } from './components/loading-card';
import { ErrorCard } from './components/error-card';
import { calculateFircResult } from './actions';
import { extractFiraData } from '@/ai/flows/extract-fira-data';
import type { FircResult } from './actions';
import type { ErrorKey } from './error-definitions';

type View = 'upload' | 'loading' | 'result' | 'error';

export default function FircCalculatorPage() {
  const [view, setView] = useState<View>('upload');
  const [resultData, setResultData] = useState<FircResult | null>(null);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Uploading...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidationError = (key: ErrorKey) => {
    setErrorKey(key);
    setView('error');
  };

  const handleFileSelect = async (file: File) => {
    setLoadingMessage('Uploading...');
    setView('loading');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const dataUri = reader.result as string;
        if (!dataUri) {
          throw new Error('Could not read file.');
        }

        // Artificial delay to ensure "Uploading..." message is visible
        await new Promise((resolve) => setTimeout(resolve, 800));

        setLoadingMessage('Extracting details from your FIRA...');
        const extractedData = await extractFiraData({ firaDataUri: dataUri });
        
        if (extractedData.error) {
            setErrorKey('EXTRACTION_FAILED');
            setView('error');
            return;
        }

        // Artificial delay to ensure "Calculating..." message is visible
        setLoadingMessage('Calculating Cost...');
        await new Promise((resolve) => setTimeout(resolve, 800));

        const result = await calculateFircResult({ extractedData });

        if (result.error) {
          setErrorKey(result.error);
          setView('error');
        } else if (result.data) {
          setResultData(result.data);
          setView('result');
        } else {
          setErrorKey('UNKNOWN_ERROR');
          setView('error');
        }
      } catch (e: any) {
        console.error(e);
        let effectiveError: ErrorKey = 'UNKNOWN_ERROR';
        if (e instanceof Error) {
            if (e.message.includes('deadline')) {
                effectiveError = 'TIMEOUT_ERROR';
            }
        }
        setErrorKey(effectiveError);
        setView('error');
      }
    };
    reader.onerror = () => {
      setErrorKey('FILE_READ_ERROR');
      setView('error');
    };
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset file input to allow uploading the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingCard message={loadingMessage} />;
      case 'result':
        return (
          <ResultsCard
            data={resultData!}
            onUploadAnother={triggerFileInput}
          />
        );
      case 'error':
        return <ErrorCard errorKey={errorKey!} onRetry={triggerFileInput} />;
      case 'upload':
      default:
        return <UploadForm onFileSelect={handleFileSelect} onValidationError={handleValidationError} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#F7FAFF] p-0">
      <main className="flex items-center justify-center transition-opacity duration-300">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
        />
        {renderContent()}
      </main>
    </div>
  );
}