'use client';

import { useState, useRef, DragEvent, useTransition, useEffect } from 'react';
import { useActionState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';
import { processFiraDocument } from '../actions';
import type { FircResult } from '../actions';
import { LoadingOverlay } from './loading-overlay';

// Figma: Upload Icon for Dropzone
const UploadIcon = ({ className }: { className?: string }) => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25.3337 16.8333L19.0003 10.5L12.667 16.8333" stroke="#145AFF" strokeWidth="2.375" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10.5V25.3333" stroke="#145AFF" strokeWidth="2.375" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.25 22.25V31.6667C33.25 32.5458 32.8942 33.3889 32.2518 34.0314C31.6093 34.6738 30.7661 35.0296 29.887 35.0296H8.11365C7.23451 35.0296 6.39133 34.6738 5.74889 34.0314C5.10645 33.3889 4.75065 32.5458 4.75065 31.6667V22.25" stroke="#145AFF" strokeWidth="2.375" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Figma: Info Icon for Privacy Disclaimer
const InfoIcon = ({ className }: { className?: string }) => (
    <div className={cn("w-[16.8px] h-[20.8px] flex-shrink-0 flex items-start justify-center pt-0.5", className)}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.39999 12.2C9.44969 12.2 11.9 9.74969 11.9 6.70001C11.9 3.65032 9.44969 1.20001 6.39999 1.20001C3.3503 1.20001 0.899994 3.65032 0.899994 6.70001C0.899994 9.74969 3.3503 12.2 6.39999 12.2Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.40039 8.6V6.7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.40039 4.8H6.40639" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);


const initialState: { data: FircResult | null; error: string | null; } = {
  data: null,
  error: null,
};

export function UploadForm({ onComplete }: { onComplete: (data: FircResult) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formState, formAction] = useActionState(processFiraDocument, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (formState.data && !isPending) {
      onComplete(formState.data);
    }
  }, [formState, onComplete, isPending]);
  
  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile && !isPending) {
      setFile(selectedFile);
      const formData = new FormData();
      formData.append('firaDocument', selectedFile);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPending) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  return (
    <>
      {isPending && <LoadingOverlay />}
      <div className="w-[450px] bg-white border border-[#F0F0F0] rounded-[16px] py-[48px] px-[32px] flex flex-col items-center gap-6">
        
        {formState.error && !isPending && (
          <div className="w-full">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="w-[386px]">
          <h1 className="font-sans text-[16px] leading-[18px] font-medium text-center text-[#0A1F44]">
            Upload your FIRA (Foreign Inward Remittance Advice) to get a detailed breakdown of your actual costs.
          </h1>
        </div>

        {/* Figma Frame: 1000005240 - Drag-and-Drop Zone */}
        <div
          className={cn(
            "w-[386px] h-[240px] flex flex-col items-center justify-center gap-4 bg-[#F5F8FF] border border-dashed border-[#145AFF] rounded-[8px] transition-colors duration-200",
            isDragging && "bg-[#E9F2FB]",
            isPending ? "cursor-not-allowed opacity-70" : "cursor-pointer",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isPending && fileInputRef.current?.click()}
          role="button"
          aria-label="Upload FIRA document"
          aria-disabled={isPending}
        >
          <input
            ref={fileInputRef}
            type="file"
            name="firaDocument"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
            disabled={isPending}
          />
          <UploadIcon />
          <div className="text-center">
            <p className="font-sans text-[16px] leading-[18px] font-normal text-[#0A1F44]">
              {file ? file.name : 'Click or drag file to this area to upload'}
            </p>
            <p className="font-sans text-[14px] leading-[16px] font-normal text-[#6A7280]">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'We accept files under 10MB in PDF, PNG, or JPEG format.'}
            </p>
          </div>
          {file && !isPending && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive z-10 font-sans text-[14px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Remove file
              </Button>
          )}
        </div>
        
        {/* Figma Frame: 1000005132 - Privacy Disclaimer */}
        <div className="w-[386px] flex items-start gap-1.5 p-[16px_12px] bg-[#F5F8FF] border border-[#DDE4ED] rounded-[12px]">
          <InfoIcon />
          <p className="font-sans text-[12px] leading-[16px] font-normal text-[#000000]">
            By uploading, you agree to our use of the document to provide a cost breakdown and contact you about savings. Please redact sensitive details like bank account numbers before submission.
          </p>
        </div>
      </div>
    </>
  );
}
