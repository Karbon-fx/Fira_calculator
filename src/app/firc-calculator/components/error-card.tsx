'use client';

import { getErrorContent, ErrorKey } from '../error-definitions';

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

// Main icon for the error card, representing a corrupted document with a warning badge.
const FiraUploadErrorIcon = () => (
    <svg width="125" height="139" viewBox="0 0 125 139" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_10601_33393)">
            <path d="M5.99805 6V125.5L16.6315 119.525L27.265 125.5L37.8985 119.525L48.5319 125.5L59.1654 119.525L69.7989 125.5L80.4324 119.525L91.0658 125.5V6L80.4324 11.975L69.7989 6L59.1654 11.975L48.5319 6L37.8985 11.975L27.265 6L16.6315 11.975L5.99805 6Z" fill="white"/>
            <path d="M70.8103 32.3301H26.251Z" fill="white"/>
            <path d="M70.8103 32.3301H26.251" stroke="#F9A825" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70.1378 48.5332H26.9287Z" fill="white"/>
            <path d="M70.1378 48.5332H26.9287" stroke="#F9A825" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M70.8103 64.7383H26.251Z" fill="white"/>
            <path d="M70.8103 64.7383H26.251" stroke="#F9A825" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M47.8581 80.9414H26.9287Z" fill="white"/>
            <path d="M47.8581 80.9414H26.9287" stroke="#F9A825" strokeWidth="2.24062" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <rect x="64.9648" y="79.1934" width="59.75" height="59.75" rx="29.875" fill="#F9A825"/>
        <path d="M95.0335 115.041C95.3759 115.041 95.6629 114.925 95.8945 114.694C96.1261 114.462 96.2419 114.175 96.2419 113.833C96.2419 113.49 96.1261 113.203 95.8945 112.972C95.6629 112.74 95.3759 112.624 95.0335 112.624C94.6912 112.624 94.4042 112.74 94.1726 112.972C93.941 113.203 93.8252 113.49 93.8252 113.833C93.8252 114.175 93.941 114.462 94.1726 114.694C94.4042 114.925 94.6912 115.041 95.0335 115.041ZM93.8252 110.208H96.2419V102.958H93.8252V110.208ZM95.0335 121.083C93.362 121.083 91.7912 120.765 90.321 120.131C88.8509 119.497 87.5721 118.636 86.4846 117.548C85.3971 116.461 84.5361 115.182 83.9018 113.712C83.2674 112.242 82.9502 110.671 82.9502 108.999C82.9502 107.328 83.2674 105.757 83.9018 104.287C84.5361 102.817 85.3971 101.538 86.4846 100.45C87.5721 99.3629 88.8509 98.502 90.321 97.8676C91.7912 97.2332 93.362 96.916 95.0335 96.916C96.7051 96.916 98.2759 97.2332 99.746 97.8676C101.216 98.502 102.495 99.3629 103.582 100.45C104.67 101.538 105.531 102.817 106.165 104.287C106.8 105.757 107.117 107.328 107.117 108.999C107.117 110.671 106.8 112.242 106.165 113.712C105.531 115.182 104.67 116.461 103.582 117.548C102.495 118.636 101.216 119.497 99.746 120.131C98.2759 120.765 96.7051 121.083 95.0335 121.083ZM95.0335 118.666C97.7321 118.666 100.018 117.73 101.891 115.857C103.764 113.984 104.7 111.698 104.7 108.999C104.7 106.301 103.764 104.015 101.891 102.142C100.018 100.269 97.7321 99.3327 95.0335 99.3327C92.3349 99.3327 90.0492 100.269 88.1762 102.142C86.3033 104.015 85.3669 106.301 85.3669 108.999C85.3669 111.698 86.3033 113.984 88.1762 115.857C90.0492 117.73 92.3349 118.666 95.0335 118.666Z" fill="#E8EAED"/>
        <defs>
            <filter id="filter0_d_10601_33393" x="0.023047" y="0.0250001" width="97.0184" height="131.45" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="2.9875"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10601_33393"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10601_33393" result="shape"/>
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
    <div className="w-[450px] h-[749px] bg-white border border-[#F0F0F0] rounded-[16px] flex flex-col items-center justify-center p-[48px_32px] gap-[24px]">
        
        <FiraUploadErrorIcon />

        <h1 className="w-[386px] font-sans font-bold text-[16px] leading-[18px] text-center tracking-[-0.16px] text-[#0A1F44] self-stretch">
            {headline}
        </h1>
        
        <div className="w-[386px] bg-[#F5F8FF] border border-[#DDE4ED] rounded-[12px] p-[16px_12px] flex flex-row items-start gap-[6px] self-stretch">
            <InfoIcon />
            <p className="flex-grow font-sans text-[12px] leading-[16px] text-black font-bold">
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
