import React from 'react';
import { ConversionFormat } from '../types';
import { FileJson, FileText, Code, Table, FileType2 } from 'lucide-react';

interface FormatSelectorProps {
  selectedFormat: ConversionFormat;
  onSelect: (format: ConversionFormat) => void;
  disabled: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ selectedFormat, onSelect, disabled }) => {
  const formats = [
    { type: ConversionFormat.MARKDOWN, icon: <FileText className="w-5 h-5" />, label: "Markdown", desc: "Clean text with formatting" },
    { type: ConversionFormat.JSON, icon: <FileJson className="w-5 h-5" />, label: "JSON", desc: "Structured data" },
    { type: ConversionFormat.CSV, icon: <Table className="w-5 h-5" />, label: "CSV", desc: "Spreadsheet ready" },
    { type: ConversionFormat.HTML, icon: <Code className="w-5 h-5" />, label: "HTML", desc: "Web ready content" },
    { type: ConversionFormat.SUMMARY, icon: <FileType2 className="w-5 h-5" />, label: "Summary", desc: "Key points only" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      {formats.map((fmt) => (
        <button
          key={fmt.type}
          onClick={() => onSelect(fmt.type)}
          disabled={disabled}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
            selectedFormat === fmt.type
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`mb-2 ${selectedFormat === fmt.type ? 'text-indigo-600' : 'text-slate-400'}`}>
            {fmt.icon}
          </div>
          <span className="font-semibold text-sm">{fmt.label}</span>
          <span className="text-xs text-slate-400 mt-1">{fmt.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default FormatSelector;