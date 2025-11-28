import React from 'react';
import { Download, Copy, Check, RefreshCw } from 'lucide-react';
import { ConversionFormat } from '../types';

interface ResultViewerProps {
  content: string;
  format: ConversionFormat;
  onReset: () => void;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ content, format, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<ConversionFormat, string> = {
      [ConversionFormat.MARKDOWN]: 'md',
      [ConversionFormat.JSON]: 'json',
      [ConversionFormat.CSV]: 'csv',
      [ConversionFormat.HTML]: 'html',
      [ConversionFormat.SUMMARY]: 'txt',
    };

    const ext = extensions[format] || 'txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-document.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
            <Check className="w-4 h-4" />
          </span>
          <h3 className="font-semibold text-slate-800">Conversion Complete</h3>
        </div>
        <div className="flex items-center space-x-2">
           <button
            onClick={onReset}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            title="Convert another"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{format} Preview</span>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-slate-50 p-4">
        <pre className="w-full h-full p-4 bg-white rounded-lg border border-slate-200 text-sm font-mono text-slate-700 overflow-auto whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default ResultViewer;