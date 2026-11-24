import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth/mammoth.browser';

// Point the PDF worker at the bundled worker file via Vite URL import trick.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

export type ExtractResult = {
  text: string;
  fileName: string;
  fileSize: number;
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export class ExtractionError extends Error {}

export async function extractTextFromFile(file: File): Promise<ExtractResult> {
  if (file.size > MAX_BYTES) {
    throw new ExtractionError(`File exceeds the 5 MB limit (${(file.size / 1_048_576).toFixed(1)} MB).`);
  }

  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt') {
    const text = await readAsText(file);
    return { text, fileName: file.name, fileSize: file.size };
  }

  if (ext === 'pdf') {
    const text = await extractFromPdf(file);
    return { text, fileName: file.name, fileSize: file.size };
  }

  if (ext === 'docx' || ext === 'doc') {
    const text = await extractFromDocx(file);
    return { text, fileName: file.name, fileSize: file.size };
  }

  throw new ExtractionError(`Unsupported file type ".${ext}". Please upload a PDF, DOCX, or TXT file.`);
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new ExtractionError('Could not read file.'));
    reader.readAsText(file);
  });
}

async function extractFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(pageText);
  }
  return pages.join('\n');
}

async function extractFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
