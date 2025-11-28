import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  onClear: () => void;
  currentFile: File | null;
  disabled: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted, onClear, currentFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please upload PDF, JPG, PNG, or WebP.");
      return false;
    }
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      setError("File is too large. Maximum size is 20MB.");
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    setError(null);

    // Fix: Explicitly cast to File[] as Array.from inference might be unknown
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      if (validateFile(files[0])) {
        onFileAccepted(files[0]);
      }
    }
  }, [onFileAccepted, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null);
      if (validateFile(e.target.files[0])) {
        onFileAccepted(e.target.files[0]);
      }
    }
  };

  if (currentFile) {
    return (
      <div className="relative p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl flex items-center justify-between animate-fade-in">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <FileIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-md">
              {currentFile.name}
            </p>
            <p className="text-sm text-slate-500">
              {(currentFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            className="p-2 hover:bg-indigo-100 rounded-full text-slate-500 hover:text-red-500 transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:shadow-md transition-shadow">
          <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
        </div>
        <p className="text-lg font-medium text-slate-700 mb-1">
          Click to upload or drag & drop
        </p>
        <p className="text-sm text-slate-500">
          PDF, JPG, PNG, WebP (Max 20MB)
        </p>
        <p className="text-xs text-indigo-500 mt-4 bg-indigo-50 px-3 py-1 rounded-full font-medium">
          Supports multi-page PDFs
        </p>
      </div>
      
      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Dropzone;