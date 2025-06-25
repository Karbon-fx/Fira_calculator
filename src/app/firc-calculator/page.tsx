'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { processFiraDocument } from './actions';
import { UploadForm } from './components/upload-form';
import { ResultsCard } from './components/results-card';
import { LoadingOverlay } from './components/loading-overlay';
import { Logo } from '@/components/logo';

const initialState = {
  data: null,
  error: null,
};

export default function FircCalculatorPage() {
  const [formState, formAction] = useActionState(processFiraDocument, initialState);
  const [isPending, startTransition] = useTransition();

  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleUploadAnother = () => {
    window.location.reload();
  };

  const handleContactClick = () => {
    // Placeholder for "Get in Touch" logic
    alert('Get in Touch clicked!');
  };

  const handleCopyLink = () => {
    // Placeholder for "Copy Link" logic
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  };
  
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    if (formState.error) {
      setFormKey(Date.now());
    }
  }, [formState.error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#E9F2FB] p-4 sm:p-6 md:p-8">
      {isPending && <LoadingOverlay />}
      <div className="w-full max-w-2xl py-8">
        <header className="mb-8 flex justify-center">
            <Logo className="h-8 w-auto text-primary" />
        </header>
        
        <main>
          {formState.data && !isPending ? (
            <ResultsCard 
                data={formState.data} 
                onUploadAnother={handleUploadAnother}
                onContactClick={handleContactClick}
                onCopyLink={handleCopyLink}
            />
          ) : (
            <form action={handleFormAction} key={formKey}>
              <UploadForm error={formState.error} />
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
