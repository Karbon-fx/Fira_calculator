
export const ERROR_DEFINITIONS = {
  // Client-side upload errors
  FILE_TOO_LARGE: {
    headline: 'File Size Exceeds Limit',
    message: 'Your file is too large. Please upload a FIRA less than 10MB.',
  },
  UNSUPPORTED_FILE_TYPE: {
    headline: 'Unsupported File Type',
    message: 'This file format is not supported. Please upload a PDF, PNG, or JPEG version of your FIRA.',
  },
  FILE_READ_ERROR: {
    headline: 'Upload Failed – File appears to be corrupted',
    message: 'We were unable to read the file. Kindly verify the file and attempt to upload a valid FIRA document.',
  },
  NETWORK_ERROR: {
      headline: 'Upload Failed – Network Error',
      message: 'There was a problem uploading your file. Please check your internet connection and try again.',
  },

  // Server-side analysis errors
  EXTRACTION_FAILED: {
    headline: 'Unable to Extract FIRA Data',
    message: 'We couldn’t extract the required information from your document. Please try a clearer file or a different FIRA.',
  },
  FX_API_ERROR: {
    headline: 'Could Not Fetch FX Rate',
    message: 'We could not retrieve the exchange rate for the given date. The API may be down or data may not be available.',
  },
  TIMEOUT_ERROR: {
    headline: 'Analysis Timed Out',
    message: 'The request timed out. The document may be too complex. Please try again with a clearer file.',
  },
  UNKNOWN_ERROR: {
    headline: 'An Unexpected Error Occurred',
    message: 'Something went wrong during the analysis. Please try again or contact support if the problem persists.',
  },
};

export type ErrorKey = keyof typeof ERROR_DEFINITIONS;

export const getErrorContent = (errorKey: string | null) => {
    if (errorKey && errorKey in ERROR_DEFINITIONS) {
        return ERROR_DEFINITIONS[errorKey as ErrorKey];
    }
    // Default/fallback error
    return ERROR_DEFINITIONS.FILE_READ_ERROR;
};
