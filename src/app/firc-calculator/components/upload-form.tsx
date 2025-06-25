'use client';

import { useState, useRef, DragEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';

// Figma: Receipt Icon Stack
const ReceiptIcon = ({ className }: { className?: string }) => (
    <div className={cn("relative w-[85.07px] h-[119.5px] drop-shadow-[0_0_5.975px_rgba(0,0,0,0.25)]", className)}>
        <svg width="86" height="120" viewBox="0 0 86 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
            <path d="M1.37503 1.00003L1.375 112.525C1.375 112.525 2.5 118.5 8.025 118.5C13.55 118.5 14.9 112.525 14.9 112.525L14.825 1.00003L1.37503 1.00003Z" fill="white" stroke="#0657D0" strokeOpacity="0.1" strokeWidth="1.75"/>
            <path d="M84.5703 1L84.5703 112.425C84.5703 112.425 83.4453 118.425 77.9203 118.425C72.3953 118.425 71.0453 112.425 71.0453 112.425L71.1203 1L84.5703 1Z" fill="white" stroke="#0657D0" strokeOpacity="0.1" strokeWidth="1.75"/>
            <path d="M71.1203 1H14.825L14.9 112.525C14.9 112.525 16.025 118.5 21.55 118.5C27.075 118.5 28.425 112.525 28.425 112.525L28.35 1H43.425L43.35 112.525C43.35 112.525 44.475 118.5 50 118.5C55.525 118.5 56.875 112.525 56.875 112.525L56.8 1H71.1203Z" fill="white" stroke="#0657D0" strokeOpacity="0.1" strokeWidth="1.75"/>
            <path d="M28.35 41.525H56.8V48.525H28.35V41.525Z" fill="#0657D0" fillOpacity="0.2"/>
            <path d="M28.35 59.425H56.8V66.425H28.35V59.425Z" fill="#0657D0" fillOpacity="0.2"/>
            <path d="M28.35 77.325H47.15V84.325H28.35V77.325Z" fill="#0657D0" fillOpacity="0.2"/>
        </svg>
        <div className="absolute bottom-0 right-0 w-[59.75px] h-[59.75px] bg-[#0657D0] rounded-full flex items-center justify-center">
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4363 12.0117L13.4393 8.01465L9.44238 12.0117" stroke="white" strokeWidth="1.74271" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.4395 8.01465V18.9818" stroke="white" strokeWidth="1.74271" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22.4828 14.896V22.4823C22.4828 22.9554 22.2961 23.4093 21.9671 23.7383C21.6381 24.0673 21.1842 24.2539 20.7111 24.2539H6.16788C5.69482 24.2539 5.24089 24.0673 4.91189 23.7383C4.58289 23.4093 4.39624 22.9554 4.39624 22.4823V14.896" stroke="white" strokeWidth="1.74271" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    </div>
);

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


function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !hasFile} className="w-full">
      {pending ? 'Analyzing...' : 'Analyze FIRA'}
    </Button>
  );
}

export function UploadForm({ error }: { error: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  return (
    // Figma Frame: 1000005238 - Main Container
    <div className="w-[450px] bg-white border border-[#F0F0F0] rounded-[16px] py-[48px] px-[32px] flex flex-col items-center gap-6">
      
      {error && (
        <div className="w-full">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <ReceiptIcon />

      <div className="w-[386px]">
        <h1 className="font-sans text-[16px] leading-[18px] font-medium text-center text-[#0A1F44]">
          Upload your FIRA (Foreign Inward Remittance Advice) to get a detailed breakdown of your actual costs.
        </h1>
      </div>

      {/* Figma Frame: 1000005240 - Drag-and-Drop Zone */}
      <div
        className={cn(
          "w-[386px] h-[240px] flex flex-col items-center justify-center gap-4 bg-[#F5F8FF] border border-dashed border-[#145AFF] rounded-[8px] cursor-pointer transition-colors duration-200",
          isDragging && "bg-[#E9F2FB]"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        aria-label="Upload FIRA document"
      >
        <input
          ref={fileInputRef}
          type="file"
          name="firaDocument"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          required
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
        {file && (
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

      <div className="w-full">
        <SubmitButton hasFile={!!file} />
      </div>

       <footer className="text-center text-xs text-[#1F1F1F] mt-2 font-sans">
          Powered by Karbon & Google Gemini.
        </footer>
    </div>
  );
}
