'use client';

import { useState } from 'react';
import { UploadForm } from './components/upload-form';
import { ResultsCard } from './components/results-card';
import { LoadingCard } from './components/loading-card';
import { ErrorCard } from './components/error-card';
import { analyzeFira } from './actions';
import type { FircResult } from './actions';
import type { ErrorKey } from './error-definitions';

type View = 'upload' | 'loading' | 'result' | 'error';

export default function FircCalculatorPage() {
  const [view, setView] = useState<View>('upload');
  const [resultData, setResultData] = useState<FircResult | null>(null);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);

  const handleValidationError = (key: ErrorKey) => {
    setErrorKey(key);
    setView('error');
  };

  const handleFileSelect = async (file: File) => {
    setView('loading');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const dataUri = reader.result as string;
        if (!dataUri) {
          throw new Error('Could not read file.');
        }

        const result = await analyzeFira({ firaDataUri: dataUri });

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
        setErrorKey('UNKNOWN_ERROR');
        setView('error');
      }
    };
    reader.onerror = () => {
      setErrorKey('FILE_READ_ERROR');
      setView('error');
    };
  };

  const handleReset = () => {
    setView('upload');
    setResultData(null);
    setErrorKey(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingCard />;
      case 'result':
        return (
          <ResultsCard
            data={resultData!}
            onUploadAnother={handleReset}
          />
        );
      case 'error':
        return <ErrorCard errorKey={errorKey!} onRetry={handleReset} />;
      case 'upload':
      default:
        return <UploadForm onFileSelect={handleFileSelect} onValidationError={handleValidationError} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#E9F2FB] p-4 sm:p-6 md:p-8">
      <main className="flex items-center justify-center transition-opacity duration-300">
        {renderContent()}
      </main>
    </div>
  );
}
