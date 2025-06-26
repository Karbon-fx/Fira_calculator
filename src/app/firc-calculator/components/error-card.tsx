'use client';

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
    <div className="relative w-[85.07px] h-[119.5px]">
      {/* Document Body with Shadow */}
      <div className="absolute w-[85.07px] h-[119.5px] bg-white rounded-lg drop-shadow-[0_0_5.975px_rgba(0,0,0,0.25)]">
        {/* Document lines using gray color from design system */}
        <div className="absolute top-[26.31px] left-[20.25px] w-[44.56px] h-[2.98px] bg-[#CBD5E1] rounded-full" />
        <div className="absolute top-[42.5px] left-[20.25px] w-[37.81px] h-[2.98px] bg-[#CBD5E1] rounded-full" />
        <div className="absolute top-[58.68px] left-[20.25px] w-[41.56px] h-[2.98px] bg-[#CBD5E1] rounded-full" />
        <div className="absolute top-[74.87px] left-[20.25px] w-[31.87px] h-[2.98px] bg-[#CBD5E1] rounded-full" />
      </div>
      {/* Warning Badge */}
      <div className="absolute w-[59.75px] h-[59.75px] left-[25.32px] top-[59.75px] bg-[#F9A825] rounded-full flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Exclamation mark ! */}
            <path d="M12 8V13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17.5H12.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
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
  onRetry,
}: {
  message: string; // The message prop is kept for interface consistency but is not used, per design.
  onRetry: () => void;
}) {
  return (
    <div className="w-[450px] h-[749px] bg-white border border-[#F0F0F0] rounded-[16px] flex flex-col items-center justify-center p-[48px_32px] gap-[24px]">
        
        <FiraUploadErrorIcon />

        <h1 className="w-[386px] font-sans font-bold text-[16px] leading-[18px] text-center tracking-[-0.16px] text-[#0A1F44] self-stretch">
            Upload Failed – File appears to be corrupted
        </h1>
        
        <div className="w-[386px] bg-[#F5F8FF] border border-[#DDE4ED] rounded-[12px] p-[16px_12px] flex flex-row items-start gap-[6px] self-stretch">
            <InfoIcon />
            <p className="flex-grow font-sans font-bold text-[12px] leading-[16px] text-black">
                We were unable to read the file. Kindly verify the file and attempt to upload a valid FIRA document.
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
