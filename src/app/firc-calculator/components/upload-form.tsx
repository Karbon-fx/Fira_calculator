'use client';

import { useState, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import type { ErrorKey } from '../error-definitions';

const FiraDocumentIcon = () => (
    <svg width="126" height="139" viewBox="0 0 126 139" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_10598_32091)">
    <path d="M6.96387 6V125.5L17.5973 119.525L28.2308 125.5L38.8643 119.525L49.4978 125.5L60.1312 119.525L70.7647 125.5L81.3982 119.525L92.0317 125.5V6L81.3982 11.975L70.7647 6L60.1312 11.975L49.4978 6L38.8643 11.975L28.2308 6L17.5973 11.975L6.96387 6Z" fill="white"/>
    <path d="M71.7761 32.3301H27.2168Z" fill="white"/>
    <path d="M71.7761 32.3301H27.2168" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M71.1036 48.5332H27.8945Z" fill="white"/>
    <path d="M71.1036 48.5332H27.8945" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M71.7761 64.7383H27.2168Z" fill="white"/>
    <path d="M71.7761 64.7383H27.2168" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M48.8239 80.9414H27.8945Z" fill="white"/>
    <path d="M48.8239 80.9414H27.8945" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <rect x="65.9307" y="79.1934" width="59.75" height="59.75" rx="29.875" fill="#0657D0"/>
    <path d="M109.249 113.55V119.525C109.249 120.317 108.934 121.077 108.374 121.637C107.814 122.198 107.054 122.513 106.261 122.513H85.3488C84.5565 122.513 83.7966 122.198 83.2363 121.637C82.6761 121.077 82.3613 120.317 82.3613 119.525V113.55M103.274 103.094L95.8051 95.625M95.8051 95.625L88.3363 103.094M95.8051 95.625L95.8051 113.55" stroke="white" strokeWidth="1.74271" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
    <filter id="filter0_d_10598_32091" x="0.988867" y="0.0250001" width="97.0184" height="131.45" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset/>
    <feGaussianBlur stdDeviation="2.9875"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10598_32091"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10598_32091" result="shape"/>
    </filter>
    </defs>
  </svg>
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

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, 'File is empty.')
  .refine(
    (file) => file.size <= MAX_FILE_SIZE_BYTES,
    `File size must be less than ${MAX_FILE_SIZE_MB}MB.`
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'Invalid file type. Only PDF, PNG, and JPEG are accepted.'
  );

export function UploadForm({ onFileSelect, onValidationError }: { 
  onFileSelect: (file: File) => void;
  onValidationError: (errorKey: ErrorKey) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFile = (selectedFile: File | null) => {
    if (selectedFile) {
      const validation = fileSchema.safeParse(selectedFile);
      if (!validation.success) {
        const issue = validation.error.issues[0];
        if (issue.message.includes('size')) {
          onValidationError('FILE_TOO_LARGE');
        } else if (issue.message.includes('type')) {
          onValidationError('UNSUPPORTED_FILE_TYPE');
        } else {
          onValidationError('UNKNOWN_ERROR');
        }
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setFile(selectedFile);
      onFileSelect(selectedFile);
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
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  return (
    <>
      <div className="w-[450px] h-[749px] bg-white border border-[#F0F0F0] rounded-[16px] py-[32px] px-[32px] flex flex-col items-center justify-center gap-4">

        <FiraDocumentIcon />

        <h1 className="w-[386px] font-sans text-[16px] leading-[18px] font-bold text-center text-[#0A1F44]">
            Upload your FIRA (Foreign Inward Remittance Advice) to get a detailed breakdown of your actual costs.
        </h1>
        
        <div
          className={cn(
            "w-[386px] h-[240px] flex flex-col items-center justify-center gap-4 bg-[#F5F8FF] border border-dashed border-[#145AFF] rounded-[8px] transition-colors duration-200 cursor-pointer",
            isDragging && "bg-[#E9F2FB]",
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
            onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
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
        
        <div className="w-[386px] flex items-start gap-1.5 p-[16px_12px] bg-[#F5F8FF] border border-[#DDE4ED] rounded-[12px]">
          <InfoIcon />
          <p className="font-sans text-[12px] leading-[16px] font-bold text-[#000000]">
            By uploading, you agree to our use of the document to provide a cost breakdown and contact you about savings. Please redact sensitive details like bank account numbers before submission.
          </p>
        </div>
      </div>
    </>
  );
}
