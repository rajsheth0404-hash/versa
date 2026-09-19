import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { auth, googleProvider, db, storage, isFirebaseConfigured } from './firebase';
import { AcademicResource, UserProfile, AttendanceCourse, FlashcardDeck, MermaidDiagram, Subject } from './types';

// ==========================================
// 1. FIREBASE AUTHENTICATION SERVICES
// ==========================================

export async function signInWithSomaiyaGoogle(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    return {
      success: false,
      error: 'Firebase is not configured yet. Please add your credentials to .env.local to enable real Google Auth.',
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const email = fbUser.email || '';

    // Institutional Domain Validation (@somaiya.edu or @somaiya.edu.in)
    if (!email.toLowerCase().endsWith('@somaiya.edu') && !email.toLowerCase().endsWith('@somaiya.edu.in')) {
      await signOut(auth);
      return {
        success: false,
        error: `Access Denied: ${email} is not an official @somaiya.edu institutional Google account.`,
      };
    }

    const isAdmin = email.startsWith('admin') || email.includes('faculty') || email.includes('council');
    const userProfile: UserProfile = {
      id: fbUser.uid,
      email: email.toLowerCase(),
      fullName: fbUser.displayName || email.split('@')[0],
      avatarUrl: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'Student')}&background=10B981&color=080A08&bold=true&size=128`,
      role: isAdmin ? 'admin' : 'student',
      currentSemester: 1,
      createdAt: new Date().toISOString(),
    };

    // Also persist user profile in Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'users', userProfile.id), userProfile, { merge: true });
      } catch (err) {
        console.warn('Could not save user profile to Firestore:', err);
      }
    }

    return { success: true, user: userProfile };
  } catch (err: any) {
    console.error('Firebase Google Sign-In error:', err);
    return {
      success: false,
      error: err?.message || 'Authentication with Google failed.',
    };
  }
}

export async function signOutFirebaseUser(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
}

export function subscribeToAuthChanges(onUserChanged: (user: FirebaseUser | null) => void) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, onUserChanged);
}

// ==========================================
// 2. FIREBASE CLOUD STORAGE SERVICES
// ==========================================

export interface StorageUploadResult {
  downloadUrl: string;
  fileName: string;
  fileSizeBytes: number;
  fileMime: string;
}

export function uploadResourceFileToStorage(
  file: File,
  folder = 'academic-resources',
  onProgress?: (progressPercent: number) => void
): Promise<StorageUploadResult> {
  return new Promise((resolve, reject) => {
    if (!isFirebaseConfigured || !storage) {
      // Fallback simulation when Firebase Storage credentials are placeholder
      const cleanFileName = file.name;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        if (onProgress) onProgress(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            downloadUrl: URL.createObjectURL(file),
            fileName: cleanFileName,
            fileSizeBytes: file.size,
            fileMime: file.type || 'application/pdf',
          });
        }
      }, 150);
      return;
    }

    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fileRef = ref(storage, `${folder}/${safeFileName}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            fileName: file.name,
            fileSizeBytes: file.size,
            fileMime: file.type || 'application/pdf',
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// ==========================================
// 3. CLOUD FIRESTORE DATABASE SERVICES
// ==========================================

export async function saveResourceToCloud(resource: AcademicResource): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, 'resources', resource.id), {
      ...resource,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to sync resource to Firestore:', err);
  }
}

export async function deleteResourceFromCloud(resourceId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await deleteDoc(doc(db, 'resources', resourceId));
  } catch (err) {
    console.error('Failed to delete resource from Firestore:', err);
  }
}

export async function fetchCloudResources(): Promise<AcademicResource[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'resources'));
    return querySnapshot.docs.map((d) => d.data() as AcademicResource);
  } catch (err) {
    console.warn('Failed to fetch resources from Firestore:', err);
    return [];
  }
}

export async function saveAttendanceToCloud(userId: string, records: AttendanceCourse[]): Promise<void> {
  if (!isFirebaseConfigured || !db || !userId) return;
  try {
    await setDoc(doc(db, 'attendance', userId), {
      records,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to save attendance to Firestore:', err);
  }
}

export async function fetchAttendanceFromCloud(userId: string): Promise<AttendanceCourse[] | null> {
  if (!isFirebaseConfigured || !db || !userId) return null;
  try {
    const docSnap = await getDocs(query(collection(db, 'attendance'), where('__name__', '==', userId)));
    if (!docSnap.empty) {
      const data = docSnap.docs[0].data();
      return data.records || null;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch attendance from Firestore:', err);
    return null;
  }
}

export async function saveFlashcardDeckToCloud(deck: FlashcardDeck): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, 'flashcard_decks', deck.id), deck, { merge: true });
  } catch (err) {
    console.warn('Failed to save flashcard deck to Firestore:', err);
  }
}

export async function fetchCloudFlashcards(): Promise<FlashcardDeck[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const snap = await getDocs(collection(db, 'flashcard_decks'));
    return snap.docs.map((d) => d.data() as FlashcardDeck);
  } catch (err) {
    return [];
  }
}
