import { useState, useCallback, useRef } from 'react';
import {
  Compass, UploadCloud, FileText, Loader2,
  CheckCircle2, XCircle, ArrowRight, Layers
} from 'lucide-react';
import { extractTextFromFile, ExtractionError } from '../lib/textExtraction';

type Props = {
  onAnalyzed: (resumeText: string, fileName: string) => void;
};

type UploadState = 'idle' | 'dragging' | 'extracting' | 'done' | 'error';

export function LandingScreen({ onAnalyzed }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setUploadState('extracting');
    setErrorMsg('');
    try {
      const result = await extractTextFromFile(file);
      setResumeText(result.text);
      setFileName(result.fileName);
      setFileSize(result.fileSize);
      setUploadState('done');
    } catch (e) {
      setErrorMsg(e instanceof ExtractionError ? e.message : 'Failed to extract text. Try a different file.');
      setUploadState('error');
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(80% 55% at 50% -5%, rgba(216,155,74,0.15) 0%, rgba(216,155,74,0) 65%)',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-300 px-3 py-1 text-xs text-muted-light mb-6 animate-fade-in">
            <Compass size={13} className="text-brass" />
            Resume skill-gap analyzer
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-medium leading-[1.1] text-cream animate-fade-in">
            Find the route from
            <br />
            <span className="text-brass">here</span> to{' '}
            <span className="italic">hired</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-muted leading-relaxed animate-fade-in">
            Upload your resume and SkillMatch AI instantly scores you against{' '}
            <span className="text-cream-200">all four</span> target roles — then shows exactly
            what's missing and maps your roadmap to close the gap.
          </p>

          {/* Flow steps */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
            <FlowStep n="1" label="Upload resume" />
            <Chevron />
            <FlowStep n="2" label="See ranked matches" />
            <Chevron />
            <FlowStep n="3" label="Follow roadmap" />
          </div>
        </div>
      </section>

      {/* Upload zone */}
      <section className="mx-auto w-full max-w-2xl px-4 sm:px-6 pb-16 flex-1">
        <div
          role="button"
          tabIndex={0}
          aria-label="Drop zone — upload your resume"
          onDragOver={(e) => { e.preventDefault(); if (uploadState !== 'extracting') setUploadState('dragging'); }}
          onDragLeave={() => setUploadState((s) => s === 'dragging' ? 'idle' : s)}
          onDrop={onDrop}
          onClick={() => uploadState !== 'extracting' && inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          className={[
            'cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
            uploadState === 'dragging' ? 'border-brass bg-brass/5 scale-[1.01]' : '',
            uploadState === 'done'     ? 'border-brass/60 bg-brass/5' : '',
            uploadState === 'error'    ? 'border-red-500/50 bg-red-500/5' : '',
            uploadState === 'idle' || uploadState === 'extracting'
              ? 'border-ink-300 hover:border-brass/50 hover:bg-brass/5' : '',
          ].join(' ')}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="sr-only"
            onChange={onFileChange}
          />

          {uploadState === 'extracting' && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={44} className="text-brass animate-spin" />
              <p className="text-cream font-medium text-lg">Extracting text…</p>
              <p className="text-sm text-muted">Reading your file entirely in-browser</p>
            </div>
          )}

          {uploadState === 'done' && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 size={44} className="text-brass" />
              <div>
                <p className="text-cream font-medium text-lg">{fileName}</p>
                <p className="text-sm text-muted mt-0.5">{(fileSize / 1024).toFixed(0)} KB · ready to analyze</p>
              </div>
              <p className="text-xs text-muted-dark">Click or drop to swap file</p>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="flex flex-col items-center gap-3">
              <XCircle size={44} className="text-red-400" />
              <div>
                <p className="text-cream font-medium text-lg">Extraction failed</p>
                <p className="text-sm text-red-400 mt-1">{errorMsg}</p>
              </div>
              <p className="text-xs text-muted-dark mt-1">Click or drop to try again</p>
            </div>
          )}

          {(uploadState === 'idle' || uploadState === 'dragging') && (
            <div className="flex flex-col items-center gap-3">
              <UploadCloud
                size={44}
                className={`transition-colors ${uploadState === 'dragging' ? 'text-brass' : 'text-muted'}`}
              />
              <div>
                <p className="text-cream font-medium text-lg">Drop your resume here</p>
                <p className="text-sm text-muted mt-0.5">or click to browse your files</p>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-dark">
                {['PDF', 'DOCX', 'TXT'].map((fmt) => (
                  <span key={fmt} className="rounded border border-ink-300 px-2 py-0.5">{fmt}</span>
                ))}
                <span>· max 5 MB</span>
              </div>
            </div>
          )}
        </div>

        {/* Extracted text peek */}
        {resumeText && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-muted-dark hover:text-muted transition-colors select-none">
              <FileText size={11} className="inline mr-1.5" />
              View extracted text
            </summary>
            <pre className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-ink-200 p-4 text-xs text-muted leading-relaxed whitespace-pre-wrap">
              {resumeText.slice(0, 3000)}{resumeText.length > 3000 ? '\n\n[truncated…]' : ''}
            </pre>
          </details>
        )}

        {/* CTA */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onAnalyzed(resumeText, fileName)}
            disabled={uploadState !== 'done'}
            className="btn-primary text-base px-8 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Layers size={18} />
            Analyze against all roles
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-dark">
          Your file never leaves your browser — all processing is client-side.
        </p>
      </section>
    </div>
  );
}

function FlowStep({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-300 text-xs font-medium text-brass">
        {n}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="text-ink-300 hidden sm:block" fill="none">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
