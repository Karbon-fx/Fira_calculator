# **App Name**: FIRC Clarity

## Core Features:

- Document Upload: Allows users to upload FIRA documents (PDF, PNG, JPEG) via drag-and-drop or file selection, with a size limit of 10MB.
- Automated Data Extraction: Leverages the Gemini API to perform OCR and extract key data from the uploaded FIRA, including transaction date, purpose code, foreign currency amount, bank FX rate, and INR credited. Uses LLM reasoning tool.
- FX Rate Retrieval: Fetches historical FX rates (bid/ask) from FreeCurrencyAPI based on the transaction date extracted from the FIRA.
- Cost Calculation: Calculates the mid-market rate, effective bank rate, per-unit spread, total FX cost (in INR), and basis points (bps) based on the extracted and retrieved data.
- Clear Results Display: Presents a results card with tabs for Total Cost, Paise per Unit, and Basis Points, along with a prominent display of the total cost incurred.
- Detailed Breakdown: Provides a detailed breakdown of the FIRA information, calculations, and options to upload another FIRA or get in touch for further assistance.
- Error Handling: Displays appropriate error messages and handles edge cases, such as invalid file types/sizes, OCR failures, and API timeouts, ensuring a smooth user experience.

## Style Guidelines:

- Primary color: Vivid cerulean (#007BA7) to evoke trust and financial expertise.
- Background color: Very light blue-gray (#E8F0FE), a desaturated shade of the primary color.
- Accent color: Electric indigo (#6F00FF), a distinctive analogous color that stands out while remaining harmonious.
- Body and headline font: 'Inter' (sans-serif) for a modern, clean, and highly readable UI.
- Use clear and professional icons to represent data points and actions, ensuring a user-friendly experience.
- Maintain a clean and structured layout, making important information easily accessible.
- Incorporate subtle transitions and loading animations to enhance the user experience and provide visual feedback.