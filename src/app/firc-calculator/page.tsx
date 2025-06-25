'use client';

import { useState, useEffect } from 'react';
import { UploadForm } from './components/upload-form';
import { ResultsCard } from './components/results-card';
import { LoadingCard } from './components/loading-card';
import { ErrorCard } from './components/error-card';
import { analyzeFira } from './actions';
import type { FircResult } from './actions';

type View = 'upload' | 'loading' | 'result' | 'error';

/**
 * Converts an ArrayBuffer to a Base64 string in a browser-safe way.
 * @param buffer The ArrayBuffer to convert.
 * @returns A Base64-encoded string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function FircCalculatorPage() {
  const [view, setView] = useState<View>('upload');
  const [resultData, setResultData] = useState<FircResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileToProcess, setFileToProcess] = useState<File | null>(null);

  useEffect(() => {
    if (view === 'loading' && fileToProcess) {
      const processFile = async () => {
        try {
          const fileBuffer = await fileToProcess.arrayBuffer();
          const base64String = arrayBufferToBase64(fileBuffer);
          const dataUri = `data:${fileToProcess.type};base64,${base64String}`;

          const extractionPromise = analyzeFira({ firaDataUri: dataUri });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 15000) // 15 second timeout
          );

          const result = await Promise.race([extractionPromise, timeoutPromise]);

          if (result.error) {
            setError(result.error);
            setView('error');
          } else if (result.data) {
            setResultData(result.data);
            setView('result');
          } else {
            setError('An unknown error occurred during analysis.');
            setView('error');
          }
        } catch (e: any) {
          if (e instanceof Error && e.message.includes('timeout')) {
            setError(
              'Extraction timed out. The document may be too complex or the service is busy. Please try again.'
            );
          } else {
            console.error(e);
            setError('An unexpected error occurred. Please check the console.');
          }
          setView('error');
        }
      };
      processFile();
    }
  }, [view, fileToProcess]);

  const handleFileSelect = (file: File) => {
    setFileToProcess(file);
    setView('loading');
  };

  const handleReset = () => {
    setView('upload');
    setResultData(null);
    setError(null);
    setFileToProcess(null);
  };

  const handleContactClick = () => {
    // Placeholder for "Get in Touch" logic
    alert('Get in Touch clicked!');
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
            onContactClick={handleContactClick}
          />
        );
      case 'error':
        return <ErrorCard message={error!} onRetry={handleReset} />;
      case 'upload':
      default:
        return <UploadForm onFileSelect={handleFileSelect} />;
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
