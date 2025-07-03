'use client';

import { getErrorContent, ErrorKey } from '../error-definitions';
import { cn } from '@/lib/utils';

// This card is a pixel-perfect implementation of the Figma design for a FIRA upload error state.
// It is displayed when a file is determined to be unreadable or corrupted.

// Icon for the "Upload Another FIRA" button, styled as per Figma.
const UploadAnotherIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12.6667V3.33333"
        stroke="#145AFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 6L8 3.33333L5.33333 6"
        stroke="#145AFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

// Main icon for the error card, representing an interrupted upload.
const FiraUploadInterruptedIcon = () => (
    <svg width="125" height="140" viewBox="0 0 125 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_10737_11102)">
            <path d="M5.96533 6.25V125.75L16.5988 119.775L27.2323 125.75L37.8658 119.775L48.4992 125.75L59.1327 119.775L69.7662 125.75L80.3997 119.775L91.0331 125.75V6.25L80.3997 12.225L69.7662 6.25L59.1327 12.225L48.4992 6.25L37.8658 12.225L27.2323 6.25L16.5988 12.225L5.96533 6.25Z" fill="white"/>
            <path d="M70.7776 32.582H26.2183H70.7776Z" fill="white"/>
            <path d="M70.7776 32.582H26.2183" stroke="#E53935" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70.1041 48.7852H26.895H70.1041Z" fill="white"/>
            <path d="M70.1041 48.7852H26.895" stroke="#E53935" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70.7776 64.9883H26.2183H70.7776Z" fill="white"/>
            <path d="M70.7776 64.9883H26.2183" stroke="#E53935" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M47.8244 81.1914H26.895H47.8244Z" fill="white"/>
            <path d="M47.8244 81.1914H26.895" stroke="#E53935" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <rect x="64.9307" y="79.4453" width="59.75" height="59.75" rx="29.875" fill="#E53935"/>
        <path d="M94.9998 115.293C95.3422 115.293 95.6292 115.177 95.8608 114.946C96.0924 114.714 96.2082 114.427 96.2082 114.085C96.2082 113.742 96.0924 113.455 95.8608 113.224C95.6292 112.992 95.3422 112.876 94.9998 112.876C94.6575 112.876 94.3705 112.992 94.1389 113.224C93.9073 113.455 93.7915 113.742 93.7915 114.085C93.7915 114.427 93.9073 114.714 94.1389 114.946C94.3705 115.177 94.6575 115.293 94.9998 115.293ZM93.7915 110.46H96.2082V103.21H93.7915V110.46ZM94.9998 121.335C93.3283 121.335 91.7575 121.017 90.2873 120.383C88.8172 119.749 87.5384 118.888 86.4509 117.8C85.3634 116.713 84.5024 115.434 83.8681 113.964C83.2337 112.494 82.9165 110.923 82.9165 109.251C82.9165 107.58 83.2337 106.009 83.8681 104.539C84.5024 103.069 85.3634 101.79 86.4509 100.702C87.5384 99.6148 88.8172 98.7539 90.2873 98.1195C91.7575 97.4852 93.3283 97.168 94.9998 97.168C96.6714 97.168 98.2422 97.4852 99.7123 98.1195C101.182 98.7539 102.461 99.6148 103.549 100.702C104.636 101.79 105.497 103.069 106.132 104.539C106.766 106.009 107.083 107.58 107.083 109.251C107.083 110.923 106.766 112.494 106.132 113.964C105.497 115.434 104.636 116.713 103.549 117.8C102.461 118.888 101.182 119.749 99.7123 120.383C98.2422 121.017 96.6714 121.335 94.9998 121.335ZM94.9998 118.918C97.6984 118.918 99.9842 117.982 101.857 116.109C103.73 114.236 104.667 111.95 104.667 109.251C104.667 106.553 103.73 104.267 101.857 102.394C99.9842 100.521 97.6984 99.5846 94.9998 99.5846C92.3012 99.5846 90.0155 100.521 88.1425 102.394C86.2696 104.267 85.3332 106.553 85.3332 109.251C85.3332 111.95 86.2696 114.236 88.1425 116.109C90.0155 117.982 92.3012 118.918 94.9998 118.918Z" fill="#E8EAED"/>
        <defs>
            <filter id="filter0_d_10737_11102" x="-0.00966787" y="0.275" width="97.0184" height="131.45" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="2.9875"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10737_11102"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10737_11102" result="shape"/>
            </filter>
        </defs>
    </svg>
);


// Info icon for the message box
const InfoIcon = () => (
    <div className="w-[16.8px] h-[20.8px] pt-1 flex-shrink-0">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.39999 12.2C9.44969 12.2 11.9 9.74969 11.9 6.70001C11.9 3.65032 9.44969 1.20001 6.39999 1.20001C3.3503 1.20001 0.899994 3.65032 0.899994 6.70001C0.899994 9.74969 3.3503 12.2 6.39999 12.2Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.40039 8.6V6.7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.40039 4.8H6.40639" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

export function ErrorCard({
  errorKey,
  onRetry,
}: {
  errorKey: ErrorKey | string;
  onRetry: () => void;
}) {
  const { headline, message } = getErrorContent(errorKey);

  return (
    <div className="w-[450px] h-[820px] bg-[#F5F8FF] rounded-[16px] flex flex-col items-center justify-center p-[48px_24px] gap-[24px]">
        
        <FiraUploadInterruptedIcon />

        <h1 className="font-sans font-medium text-[16px] leading-[28px] text-center text-[#0A1F44] self-stretch">
            {headline}
        </h1>
        
        <div className="bg-[#F5F8FF] border border-[#DDE4ED] rounded-[12px] p-[16px_12px] flex flex-row items-start gap-[6px] self-stretch">
            <InfoIcon />
            <p className={cn(
              "flex-grow font-sans text-[12px] leading-[16px] text-black",
              errorKey === 'EXTRACTION_FAILED' ? 'font-bold' : 'font-normal'
            )}>
                {message}
            </p>
        </div>

        <button
            onClick={onRetry}
            className="flex flex-row items-center gap-[6px] text-[#145AFF] font-sans font-medium text-[14px] leading-[20px]"
        >
            <UploadAnotherIcon />
            <span>Upload Another FIRA</span>
        </button>
    </div>
  );
}
