import React, { useState } from 'react';
import { Bot, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import Dropzone from './components/Dropzone';
import FormatSelector from './components/FormatSelector';
import ResultViewer from './components/ResultViewer';
import { ConversionFormat, ProcessingStatus } from './types';
import { convertDocument } from './services/geminiService';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ConversionFormat>(ConversionFormat.MARKDOWN);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');

  const handleConvert = async () => {
    if (!file) return;

    setStatus('reading');
    setErrorMsg(null);
    setResult(null);

    // Simulate a small delay for better UX before API call
    setTimeout(async () => {
      try {
        setStatus('processing');
        const convertedText = await convertDocument(file, format, customInstructions);
        setResult(convertedText);
        setStatus('success');
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setErrorMsg(err.message || "An unexpected error occurred during conversion.");
      }
    }, 800);
  };

  const resetAll = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setErrorMsg(null);
    setCustomInstructions('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            AI DocuMorph
          </span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Powered by Gemini 2.5
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-screen flex flex-col">
        
        {/* Intro / Hero (Only show if no result) */}
        {!result && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
              Transform Documents <br />
              <span className="text-indigo-600">Instantly with AI</span>
            </h1>
            <p className="text-lg text-slate-600">
              Upload PDFs, receipts, or images. We'll extract, analyze, and convert them into structured formats like JSON, Markdown, or HTML.
            </p>
          </div>
        )}

        <div className={`flex-1 grid gap-8 ${result ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl mx-auto w-full'}`}>
          
          {/* Left Column: Input & Config */}
          <div className={`flex flex-col space-y-6 transition-all duration-500 ${result ? '' : ''}`}>
            
            {/* Step 1: Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs mr-2">1</span>
                  Upload Document
                </h2>
                {file && (
                   <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Ready</span>
                )}
              </div>
              <Dropzone 
                onFileAccepted={setFile} 
                onClear={() => { setFile(null); setStatus('idle'); }} 
                currentFile={file}
                disabled={status === 'processing' || status === 'reading'}
              />
            </div>

            {/* Step 2: Configure */}
            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${!file ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs mr-2">2</span>
                  Select Output Format
                </h2>
              </div>
              
              <FormatSelector 
                selectedFormat={format} 
                onSelect={setFormat} 
                disabled={status === 'processing' || status === 'reading'} 
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="E.g., Focus on the financial table on page 2, or summarize in French..."
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border resize-none h-24"
                  disabled={status === 'processing'}
                />
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={handleConvert}
                  disabled={!file || status === 'processing' || status === 'reading'}
                  className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-white font-semibold shadow-lg transition-all transform active:scale-[0.98] ${
                    !file || status === 'processing'
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                  }`}
                >
                  {status === 'processing' || status === 'reading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Document...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Convert Document</span>
                      <ChevronRight className="w-5 h-5 opacity-50" />
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Result */}
          {result && (
            <div className="animate-fade-in-up h-[600px] lg:h-auto">
              <ResultViewer 
                content={result} 
                format={format}
                onReset={resetAll}
              />
            </div>
          )}

        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} AI DocuMorph. Privacy Focused. Files are processed in memory.</p>
      </footer>
    </div>
  );
};

export default App;