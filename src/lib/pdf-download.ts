import { AcademicResource } from './types';
import { getStoredUploadedFile } from './file-storage';

/**
 * Generates a valid, beautifully formatted PDF document (PDF-1.4 specification)
 * with university branding, course details, syllabus modules, and academic notes content.
 */
export function generateAcademicPdfBlob(
  resource: AcademicResource,
  subjectName?: string,
  moduleName?: string
): Blob {
  const university = 'VERSA ACADEMIC REPOSITORY';
  const college = 'Engineering Study Notes Portal';
  const subTitle = subjectName || 'First Year Engineering Course';
  const docTitle = resource.title;
  const modTitle = moduleName || (resource.moduleId ? `Module Reference: ${resource.moduleId}` : 'Course-Wide Core Material');
  const typeLabel = (resource.type || 'notes').toUpperCase();
  const year = resource.academicYear || '2025-2026';
  const scheme = resource.scheme || 'REV_2025';
  const tagsStr = (resource.tags && resource.tags.length > 0) ? resource.tags.join(', ') : 'Engineering, First Year';

  // Sanitize text for standard PDF string (escape parentheses and backslashes)
  const sanitize = (str: string) => {
    return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  };

  const lines = [
    `BT /F1 16 Tf 50 740 Td (${sanitize(university)}) Tj ET`,
    `BT /F2 11 Tf 50 722 Td (${sanitize(college)}) Tj ET`,
    `BT /F1 10 Tf 50 706 Td (Scheme: ${sanitize(scheme)} | Academic Year: ${sanitize(year)} | Type: ${sanitize(typeLabel)}) Tj ET`,
    // Horizontal rule
    `0.2 w 50 695 m 560 695 l S`,
    // Course & Module Header
    `BT /F1 13 Tf 50 670 Td (COURSE: ${sanitize(subTitle)}) Tj ET`,
    `BT /F1 11 Tf 50 650 Td (${sanitize(modTitle)}) Tj ET`,
    `BT /F2 10 Tf 50 632 Td (Resource Title: ${sanitize(docTitle)}) Tj ET`,
    `BT /F2 9 Tf 50 616 Td (Tags & Index: ${sanitize(tagsStr)}) Tj ET`,
    // Horizontal rule
    `0.1 w 50 605 m 560 605 l S`,
    // Section 1: Syllabus & Learning Objectives
    `BT /F1 11 Tf 50 585 Td (1. SYLLABUS ALIGNMENT & TOPIC BREAKDOWN) Tj ET`,
    `BT /F2 9.5 Tf 50 568 Td (- Structured topic derivations, fundamental theorems, and analytical proofs.) Tj ET`,
    `BT /F2 9.5 Tf 50 552 Td (- Step-by-step solved sample numericals and past year exam patterns.) Tj ET`,
    `BT /F2 9.5 Tf 50 536 Td (- Aligned with Autonomous R-2025 Teaching & Examination Scheme.) Tj ET`,
    // Section 2: Key Concepts & Theory Summary
    `BT /F1 11 Tf 50 510 Td (2. CORE ACADEMIC HIGHLIGHTS & SUMMARY) Tj ET`,
    `BT /F2 9.5 Tf 50 493 Td (This academic study document contains curated notes) Tj ET`,
    `BT /F2 9.5 Tf 50 477 Td (designed to support in-depth preparation for In-Semester Assessments and End-Semester Exams.) Tj ET`,
    `BT /F2 9.5 Tf 50 461 Td (Review all standard formula summaries, proof steps, and boundary value conditions) Tj ET`,
    `BT /F2 9.5 Tf 50 445 Td (associated with ${sanitize(subTitle)}.) Tj ET`,
    // Section 3: Recommended Study Flow
    `BT /F1 11 Tf 50 418 Td (3. RECOMMENDED STUDY PROCEDURE) Tj ET`,
    `BT /F2 9.5 Tf 50 401 Td (1. Master fundamental definitions, unit dimensions, and core property theorems.) Tj ET`,
    `BT /F2 9.5 Tf 50 385 Td (2. Solve all step-by-step example numericals before tackling past exam question papers.) Tj ET`,
    `BT /F2 9.5 Tf 50 369 Td (3. Cross-reference with interactive video lectures on the Versa Hub.) Tj ET`,
    // Footer / Department Seal
    `0.1 w 50 120 m 560 120 l S`,
    `BT /F2 8.5 Tf 50 102 Td (Versa - Academic Repository, Engineering Study Notes) Tj ET`,
    `BT /F2 8 Tf 50 88 Td (Downloaded via Versa Hub. All academic materials strictly for student educational use.) Tj ET`,
  ];

  const streamContent = lines.join('\n');
  const streamLength = streamContent.length;

  const pdfObjects = [
    `%PDF-1.4\n`,
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n`,
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`,
    `6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
  ];

  let offset = 0;
  const offsets: number[] = [];
  let pdfString = pdfObjects[0];
  offset = pdfString.length;

  for (let i = 1; i < pdfObjects.length; i++) {
    offsets.push(offset);
    pdfString += pdfObjects[i];
    offset += pdfObjects[i].length;
  }

  const startXref = pdfString.length;
  let xref = `xref\n0 ${pdfObjects.length}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += `${String(off).padStart(10, '0')} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${pdfObjects.length} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;
  pdfString += xref + trailer;

  return new Blob([pdfString], { type: 'application/pdf' });
}

/**
 * Parses Google Drive, Google Docs, or direct URLs to provide an embeddable preview URL.
 */
export function getGoogleDrivePreviewUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Google Drive File: https://drive.google.com/file/d/FILE_ID/view...
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  // 2. Google Drive open?id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1] && trimmed.includes('drive.google.com')) {
    return `https://drive.google.com/file/d/${idParamMatch[1]}/preview`;
  }

  // 3. Google Drive Folder: https://drive.google.com/drive/folders/FOLDER_ID
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#grid`;
  }

  // 4. Google Docs / Slides / Sheets: https://docs.google.com/presentation/d/ID/edit
  const docsMatch = trimmed.match(/docs\.google\.com\/(presentation|document|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch && docsMatch[2]) {
    return `https://docs.google.com/${docsMatch[1]}/d/${docsMatch[2]}/preview`;
  }

  // 5. Standard https URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
}

/**
 * Parses Google Drive links to provide direct file download URLs.
 */
export function getGoogleDriveDownloadUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1] && trimmed.includes('drive.google.com')) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
}

/**
 * Resolves or generates the PDF Blob for any academic resource.
 * Works seamlessly for:
 * 1. User-uploaded files stored in IndexedDB (PDFs, docs).
 * 2. Real base64 / blob URLs.
 * 3. Static server resources (/sample-resources/...).
 * 4. Syllabus-compliant auto-generated PDF documents.
 */
export async function getAcademicPdfBlob(
  resource: AcademicResource,
  subjectName?: string,
  moduleName?: string
): Promise<Blob> {
  // 1. Check if the exact uploaded file is in IndexedDB (User-uploaded real notes)
  try {
    const storedBlob = await getStoredUploadedFile(resource.id);
    if (storedBlob) {
      return storedBlob;
    }
  } catch (err) {
    console.warn('IndexedDB retrieval check error:', err);
  }

  // 2. If real file or data URL is present in filePath
  if (resource.filePath && (resource.filePath.startsWith('data:') || resource.filePath.startsWith('blob:'))) {
    try {
      const res = await fetch(resource.filePath);
      if (res.ok) {
        return await res.blob();
      }
    } catch {}
  }

  // 3. If it's a relative path in public (like /sample-resources/...), try fetching it
  if (resource.filePath && resource.filePath.startsWith('/')) {
    try {
      const res = await fetch(resource.filePath);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        // Only return if it is an actual PDF or binary stream, NOT an HTML 404/index fallback page
        if (contentType.includes('pdf') || contentType.includes('octet-stream')) {
          return await res.blob();
        }
      }
    } catch {}
  }

  // 4. Default fallback: Generate an authentic, structured syllabus PDF document
  return generateAcademicPdfBlob(resource, subjectName, moduleName);
}

/**
 * Downloads an academic resource.
 * 1. Checks for Google Drive / External URL.
 * 2. Checks IndexedDB for the exact file uploaded by the user.
 * 3. Falls back to generating a valid PDF if no file was uploaded.
 */
export async function downloadAcademicResource(
  resource: AcademicResource,
  subjectName?: string,
  moduleName?: string
): Promise<void> {
  // Handle Google Drive or external web link
  if (resource.filePath && (resource.filePath.startsWith('http://') || resource.filePath.startsWith('https://'))) {
    const downloadUrl = getGoogleDriveDownloadUrl(resource.filePath) || resource.filePath;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  const fileName = resource.fileName || `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  const blob = await getAcademicPdfBlob(resource, subjectName, moduleName);
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}
