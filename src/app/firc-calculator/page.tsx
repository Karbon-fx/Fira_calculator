'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { processFiraDocument } from './actions';
import { UploadForm } from './components/upload-form';
import { ResultsCard } from './components/results-card';
import { LoadingOverlay } from './components/loading-overlay';
import type { FircResult } from './actions';

const initialState: { data: FircResult | null; error: string | null; } = {
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
  
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    if (formState.error) {
      setFormKey(Date.now());
    }
  }, [formState.error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#E9F2FB] p-4 sm:p-6 md:p-8">
      {isPending && <LoadingOverlay />}
      <main className="flex items-center justify-center">
        {formState.data && !isPending ? (
          <ResultsCard 
              data={formState.data} 
              onUploadAnother={handleUploadAnother}
              onContactClick={handleContactClick}
          />
        ) : (
          <form action={handleFormAction} key={formKey}>
            <UploadForm error={formState.error} />
          </form>
        )}
      </main>
    </div>
  );
}
