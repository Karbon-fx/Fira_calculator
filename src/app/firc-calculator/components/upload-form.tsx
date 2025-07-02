'use client';

import { useState, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import type { ErrorKey } from '../error-definitions';

const FiraUploadIcon = () => (
    <svg width="125" height="140" viewBox="0 0 125 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_10737_10820)">
            <path d="M5.96533 6.25V125.75L16.5988 119.775L27.2323 125.75L37.8658 119.775L48.4992 125.75L59.1327 119.775L69.7662 125.75L80.3997 119.775L91.0331 125.75V6.25L80.3997 12.225L69.7662 6.25L59.1327 12.225L48.4992 6.25L37.8658 12.225L27.2323 6.25L16.5988 12.225L5.96533 6.25Z" fill="white"/>
            <path d="M70.7776 32.582H26.2183H70.7776Z" fill="white"/>
            <path d="M70.7776 32.582H26.2183" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70.1041 48.7852H26.895H70.1041Z" fill="white"/>
            <path d="M70.1041 48.7852H26.895" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70.7776 64.9883H26.2183H70.7776Z" fill="white"/>
            <path d="M70.7776 64.9883H26.2183" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M47.8244 81.1914H26.895H47.8244Z" fill="white"/>
            <path d="M47.8244 81.1914H26.895" stroke="#0657D0" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <rect x="64.9307" y="79.4453" width="59.75" height="59.75" rx="29.875" fill="#0657D0"/>
        <path d="M108.249 113.8V119.775C108.249 120.567 107.934 121.327 107.374 121.887C106.814 122.448 106.054 122.763 105.261 122.763H84.3488C83.5565 122.763 82.7966 122.448 82.2363 121.887C81.6761 121.327 81.3613 120.567 81.3613 119.775V113.8M102.274 103.344L94.8051 95.875M94.8051 95.875L87.3363 103.344M94.8051 95.875L94.8051 113.8" stroke="white" strokeWidth="1.74271" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
        <filter id="filter0_d_10737_10820" x="-0.00966787" y="0.275" width="97.0184" height="131.45" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2.9875"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10737_10820"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10737_10820" result="shape"/>
        </filter>
        </defs>
    </svg>
);


const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M25.3337 16.8333L19.0003 10.5L12.667 16.8333"
      stroke="#0657D0"
      strokeWidth="2.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 10.5V25.3333"
      stroke="#0657D0"
      strokeWidth="2.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'w-[16.8px] h-[20.8px] flex-shrink-0 flex items-start justify-center pt-0.5',
      className
    )}
  >
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.39999 12.2C9.44969 12.2 11.9 9.74969 11.9 6.70001C11.9 3.65032 9.44969 1.20001 6.39999 1.20001C3.3503 1.20001 0.899994 3.65032 0.899994 6.70001C0.899994 9.74969 3.3503 12.2 6.39999 12.2Z"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.40039 8.6V6.7"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.40039 4.8H6.40639"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

export function UploadForm({
  onFileSelect,
  onValidationError,
}: {
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
    <div className="w-[450px] h-[749px] bg-white border border-[#F0F0F0] rounded-[16px] p-[48px_24px] flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col items-center gap-6 self-stretch">
        <FiraUploadIcon />
        <p className="w-full h-[42px] font-bold text-base leading-4 text-center text-[#0A1F44] flex items-center justify-center">
          Upload your FIRA (Foreign Inward Remittance Advice) to get a detailed
          breakdown of your actual costs.
        </p>
        <div
          className={cn(
            'w-full h-[240px] flex flex-col items-center justify-center gap-4 bg-white border border-dashed border-[#0657D0] rounded-[8px] transition-colors duration-200 cursor-pointer p-6',
            isDragging && 'bg-blue-50'
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
          <div className="text-center flex flex-col gap-[6px] self-stretch">
            <p className="font-sans text-[16px] leading-[28px] font-bold text-[#0A1F44]">
              {file
                ? file.name
                : 'Click or drag file to this area to upload'}
            </p>
            <p className="font-sans text-[14px] leading-[20px] font-normal text-[#6A7280]">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                : 'We accept files under 10MB in PDF, PNG, or JPEG format.'}
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
      </div>
      <div className="w-full flex items-start gap-1.5 p-[16px_12px] rounded-[12px]">
        <InfoIcon />
        <p className="font-sans text-[12px] leading-[16px] font-normal text-[#000000] flex-1">
          By uploading, you agree to our use of the document to provide a cost
          breakdown and contact you about savings. Please redact sensitive
          details like bank account numbers before submission.
        </p>
      </div>
    </div>
  );
}
