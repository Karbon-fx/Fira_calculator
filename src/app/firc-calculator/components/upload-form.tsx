'use client';

import { useState, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import type { ErrorKey } from '../error-definitions';

const FiraDocumentIcon = () => (
  <div
    className="relative w-[85.07px] h-[119.5px]"
    style={{ filter: 'drop-shadow(0px 0px 5.975px rgba(0, 0, 0, 0.25))' }}
  >
    <svg
      className="absolute"
      width="86"
      height="120"
      viewBox="0 0 86 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 0V119.5L11.1335 113.525L21.767 119.5L32.4005 113.525L43.034 119.5L53.6675 113.525L64.301 119.5L74.9345 113.525L85.568 119.5V0L74.9345 5.975L64.301 0L53.6675 5.975L43.034 0L32.4005 5.975L21.767 0L11.1335 5.975L0.5 0Z"
        fill="white"
      />
      <path
        d="M65.3122 26.3301H20.7529"
        stroke="#0657D0"
        strokeWidth="2.24062"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M64.6397 42.5332H21.4307"
        stroke="#0657D0"
        strokeWidth="2.24062"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M65.3122 58.7383H20.7529"
        stroke="#0657D0"
        strokeWidth="2.24062"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.3599 74.9414H21.4307"
        stroke="#0657D0"
        strokeWidth="2.24062"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <div className="absolute w-[59.75px] h-[59.75px] left-[50%] top-[73.2px] -translate-x-1/2 bg-[#0657D0] rounded-full flex items-center justify-center">
      <svg
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.7291 10.375L13.4999 4.14583L7.27071 10.375"
          stroke="white"
          strokeWidth="1.74271"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 4.14583V20.625"
          stroke="white"
          strokeWidth="1.74271"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.875 17.5V26C24.875 26.7417 24.6165 27.4207 24.1601 27.9103C23.7037 28.3998 23.076 28.6667 22.4167 28.6667H4.58333C3.92396 28.6667 3.29628 28.3998 2.8399 27.9103C2.38351 27.4207 2.125 26.7417 2.125 26V17.5"
          stroke="white"
          strokeWidth="1.74271"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
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
    <div className="w-[450px] h-[806px] bg-[#F5F8FF] border border-[#F0F0F0] rounded-[16px] p-[48px_24px] flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col items-center gap-9 self-stretch">
        <FiraDocumentIcon />
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
            <p className="font-sans text-[16px] leading-[28px] font-normal text-[#0A1F44]">
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
