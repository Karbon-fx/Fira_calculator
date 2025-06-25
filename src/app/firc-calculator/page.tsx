'use client';

import { useFormState } from 'react-dom';
import { useEffect, useState, useTransition } from 'react';
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
  const [formState, formAction] = useFormState(processFiraDocument, initialState);
  const [isPending, startTransition] = useTransition();

  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleReset = () => {
    window.location.reload();
  };
  
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    if (formState.error) {
      setFormKey(Date.now());
    }
  }, [formState.error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8">
      {isPending && <LoadingOverlay />}
      <div className="w-full max-w-2xl py-8">
        <header className="mb-8 flex justify-center">
            <Logo className="h-8 w-auto text-primary" />
        </header>
        
        <main>
          {formState.data && !isPending ? (
            <ResultsCard data={formState.data} onReset={handleReset} />
          ) : (
            <form action={handleFormAction} key={formKey}>
              <UploadForm error={formState.error} />
            </form>
          )}
        </main>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by Karbon & Google Gemini.
          </p>
        </footer>
      </div>
    </div>
  );
}
