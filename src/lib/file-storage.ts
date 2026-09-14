/**
 * IndexedDB and Blob File Storage for Versa Academic Hub
 * Allows storing, retrieving, and downloading exact uploaded files (PDFs, PPTs, etc.)
 */

const DB_NAME = 'versa_academic_files_db';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_resources';

interface StoredFileRecord {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  blob: Blob;
  updatedAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores an exact file uploaded by the user in IndexedDB.
 */
export async function storeUploadedFile(id: string, file: File): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const record: StoredFileRecord = {
        id,
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: file.size,
        blob: file,
        updatedAt: new Date().toISOString(),
      };

      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to store file in IndexedDB:', err);
  }
}

/**
 * Retrieves the exact file from IndexedDB by resource ID.
 */
export async function getStoredUploadedFile(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const record = req.result as StoredFileRecord | undefined;
        if (record && record.blob) {
          resolve(record.blob);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to retrieve file from IndexedDB:', err);
    return null;
  }
}

/**
 * Converts a File object to a Base64 data URI string.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
