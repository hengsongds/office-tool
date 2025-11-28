export enum ConversionFormat {
  MARKDOWN = 'Markdown',
  JSON = 'JSON',
  HTML = 'HTML',
  CSV = 'CSV',
  SUMMARY = 'Summary',
}

export interface ConvertOptions {
  format: ConversionFormat;
  instructions?: string;
}

export interface ConversionResult {
  content: string;
  format: ConversionFormat;
  timestamp: number;
}

export type ProcessingStatus = 'idle' | 'reading' | 'processing' | 'success' | 'error';
