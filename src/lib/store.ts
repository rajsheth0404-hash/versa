import {
  Subject,
  Module,
  AcademicResource,
  YouTubeResource,
  FlashcardDeck,
  MermaidDiagram,
  AttendanceCourse,
  CgpaRecord,
  UserProfile,
  SyllabusParseResult,
} from './types';

import {
  INITIAL_SUBJECTS,
  INITIAL_MODULES,
  INITIAL_RESOURCES,
  INITIAL_YOUTUBE_RESOURCES,
  INITIAL_FLASHCARD_DECKS,
  INITIAL_DIAGRAMS,
} from './somaiya-data';

const STORAGE_KEYS = {
  SUBJECTS: 'somaiya_fy_subjects_v6',
  MODULES: 'somaiya_fy_modules_v6',
  RESOURCES: 'somaiya_fy_resources_v8',
  YOUTUBE: 'versa_fy_youtube_v23',
  DECKS: 'somaiya_fy_flashcards_v3',
  DIAGRAMS: 'somaiya_fy_diagrams_v3',
  ATTENDANCE: 'somaiya_fy_attendance_v3',
  CGPA: 'somaiya_fy_cgpa_v3',
  USER: 'somaiya_fy_current_user_v3',
};

// Default First Year student user
export const DEFAULT_USER: UserProfile = {
  id: 'usr-fy-student-1',
  email: 'student.fy@somaiya.edu',
  fullName: 'First Year Student',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  role: 'student',
  currentSemester: 1,
  createdAt: new Date().toISOString(),
};

export const DEFAULT_ADMIN: UserProfile = {
  id: 'usr-admin-somaiya-1',
  email: 'admin.council@somaiya.edu',
  fullName: 'Prof. Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  role: 'admin',
  currentSemester: 1,
  createdAt: new Date().toISOString(),
};

export class HubStore {
  private static get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private static sanitizePayload<T>(value: T): T {
    if (!Array.isArray(value)) return value;
    // If array contains resources with large data: URLs, sanitize them to prevent quota crashes
    return value.map((item) => {
      if (item && typeof item === 'object' && 'filePath' in item && typeof item.filePath === 'string' && item.filePath.startsWith('data:')) {
        return {
          ...item,
          filePath: `/uploads/${item.fileName || 'document.pdf'}`,
        };
      }
      return item;
    }) as unknown as T;
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event('somaiya_store_updated'));
    } catch (e) {
      console.warn('LocalStorage quota warning, attempting sanitized save...', e);
      try {
        const sanitized = this.sanitizePayload(value);
        localStorage.setItem(key, JSON.stringify(sanitized));
        window.dispatchEvent(new Event('somaiya_store_updated'));
      } catch (innerErr) {
        console.error('Failed to persist to localStorage after sanitization', innerErr);
      }
    }
  }

  // --- Reset / Clear Methods ---
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    this.set(STORAGE_KEYS.SUBJECTS, []);
    this.set(STORAGE_KEYS.MODULES, []);
    this.set(STORAGE_KEYS.RESOURCES, []);
    this.set(STORAGE_KEYS.YOUTUBE, []);
    this.set(STORAGE_KEYS.DECKS, []);
    this.set(STORAGE_KEYS.DIAGRAMS, []);
    window.dispatchEvent(new Event('somaiya_store_updated'));
  }

  static resetToFirstYearDefaults(): void {
    this.set(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    this.set(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    this.set(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    this.set(STORAGE_KEYS.YOUTUBE, INITIAL_YOUTUBE_RESOURCES);
    this.set(STORAGE_KEYS.DECKS, INITIAL_FLASHCARD_DECKS);
    this.set(STORAGE_KEYS.DIAGRAMS, INITIAL_DIAGRAMS);
    window.dispatchEvent(new Event('somaiya_store_updated'));
  }

  // --- User & Role State ---
  static getCurrentUser(): UserProfile | null {
    const user = this.get<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (user && (user.id === 'usr-fy-student-1' || user.email === 'student.fy@somaiya.edu')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
      return null;
    }
    return user;
  }

  static setCurrentUser(user: UserProfile | null): void {
    if (user === null) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.dispatchEvent(new Event('somaiya_store_updated'));
      }
      return;
    }
    this.set(STORAGE_KEYS.USER, user);
  }

  static loginAsAdmin(): void {
    this.setCurrentUser(DEFAULT_ADMIN);
  }

  static loginAsStudent(): void {
    this.setCurrentUser(null);
  }

  // --- Subjects (Sem 1 & Sem 2 Common) ---
  static getSubjects(semester?: 1 | 2): Subject[] {
    const all = this.get<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    if (!semester) return all;
    return all.filter((s) => s.semester === semester);
  }

  static addSubject(subject: Omit<Subject, 'id'>): Subject {
    const subjects = this.getSubjects();
    const newSub: Subject = {
      ...subject,
      id: `sub-${Date.now()}`,
    };
    this.set(STORAGE_KEYS.SUBJECTS, [...subjects, newSub]);
    return newSub;
  }

  static updateSubject(id: string, updated: Partial<Subject>): void {
    const subjects = this.getSubjects().map((s) => (s.id === id ? { ...s, ...updated } : s));
    this.set(STORAGE_KEYS.SUBJECTS, subjects);
  }

  static deleteSubject(id: string): void {
    const subjects = this.getSubjects().filter((s) => s.id !== id);
    this.set(STORAGE_KEYS.SUBJECTS, subjects);
    // Cascade delete related modules and resources
    const modules = this.getModules().filter((m) => m.subjectId !== id);
    this.set(STORAGE_KEYS.MODULES, modules);
    const resources = this.getResources().filter((r) => r.subjectId !== id);
    this.set(STORAGE_KEYS.RESOURCES, resources);
  }

  // --- Modules ---
  static getModules(subjectId?: string): Module[] {
    const all = this.get<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    if (!subjectId) return all;
    return all.filter((m) => m.subjectId === subjectId);
  }

  static addModule(module: Omit<Module, 'id'>): Module {
    const modules = this.get<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    const newMod: Module = {
      ...module,
      id: `mod-${Date.now()}`,
    };
    this.set(STORAGE_KEYS.MODULES, [...modules, newMod]);
    return newMod;
  }

  static updateModule(id: string, updated: Partial<Module>): void {
    const modules = this.get<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES).map((m) =>
      m.id === id ? { ...m, ...updated } : m
    );
    this.set(STORAGE_KEYS.MODULES, modules);
  }

  static deleteModule(id: string): void {
    const modules = this.get<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES).filter((m) => m.id !== id);
    this.set(STORAGE_KEYS.MODULES, modules);
  }

  // --- Resources ---
  static getResources(filters?: { semester?: 1 | 2 | 'all'; subjectId?: string; type?: string }): AcademicResource[] {
    let list = this.get<AcademicResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    if (!filters) return list;

    if (filters.subjectId && filters.subjectId !== 'all') {
      list = list.filter((r) => r.subjectId === filters.subjectId);
    }
    if (filters.type && filters.type !== 'all') {
      list = list.filter((r) => r.type === filters.type);
    }
    if (filters.semester && filters.semester !== 'all') {
      const subjects = this.getSubjects();
      list = list.filter((r) => {
        const sub = subjects.find((s) => s.id === r.subjectId);
        return sub && sub.semester === filters.semester;
      });
    }
    return list;
  }

  static addResource(resource: Omit<AcademicResource, 'id' | 'createdAt' | 'downloadsCount'>): AcademicResource {
    const resources = this.get<AcademicResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const newRes: AcademicResource = {
      ...resource,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      downloadsCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.RESOURCES, [newRes, ...resources]);

    // Background Firestore Sync
    if (typeof window !== 'undefined') {
      import('./firebase-services').then(({ saveResourceToCloud }) => {
        saveResourceToCloud(newRes);
      }).catch((e) => console.warn('Cloud sync error:', e));
    }

    return newRes;
  }

  static addOrUpdateResourceSilent(resource: AcademicResource): void {
    const resources = this.get<AcademicResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const exists = resources.some((r) => r.id === resource.id);
    let updatedList: AcademicResource[];
    if (exists) {
      updatedList = resources.map((r) => (r.id === resource.id ? { ...r, ...resource } : r));
    } else {
      updatedList = [resource, ...resources];
    }
    this.set(STORAGE_KEYS.RESOURCES, updatedList);
  }

  static updateResource(id: string, updated: Partial<AcademicResource>): void {
    const resources = this.get<AcademicResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const modified = resources.map((r) => (r.id === id ? { ...r, ...updated } : r));
    this.set(STORAGE_KEYS.RESOURCES, modified);

    const target = modified.find((r) => r.id === id);
    if (target && typeof window !== 'undefined') {
      import('./firebase-services').then(({ saveResourceToCloud }) => {
        saveResourceToCloud(target);
      }).catch((e) => console.warn('Cloud sync error:', e));
    }
  }

  static deleteResource(id: string): void {
    const resources = this.get<AcademicResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES).filter((r) => r.id !== id);
    this.set(STORAGE_KEYS.RESOURCES, resources);

    if (typeof window !== 'undefined') {
      import('./firebase-services').then(({ deleteResourceFromCloud }) => {
        deleteResourceFromCloud(id);
      }).catch((e) => console.warn('Cloud sync error:', e));
    }
  }

  static incrementDownload(id: string): void {
    const resources = this.get<AcademicResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const updated = resources.map((r) => (r.id === id ? { ...r, downloadsCount: r.downloadsCount + 1 } : r));
    this.set(STORAGE_KEYS.RESOURCES, updated);
  }

  // --- YouTube Video Resources ---
  static getYouTubeResources(subjectId?: string): YouTubeResource[] {
    const all = this.get<YouTubeResource[]>(STORAGE_KEYS.YOUTUBE, INITIAL_YOUTUBE_RESOURCES);
    const cleaned = all
      .filter((y) => y.id !== 'yt-bio-master' && y.subjectId !== 'sub-bio')
      .map((y) => {
        if (y.videoId === 'b4N4qI2kU24') {
          const init = INITIAL_YOUTUBE_RESOURCES.find((r) => r.id === y.id);
          return { ...y, videoId: init?.videoId || '34dOqQ9kF10', youtubeUrl: init?.youtubeUrl || 'https://www.youtube.com/watch?v=34dOqQ9kF10' };
        }
        if (y.id === 'yt-spm-pointers' || y.id === 'yt-spm-master') {
          return {
            ...y,
            id: 'yt-spm-master',
            title: 'Structured Programming Methodology in C: Complete Syllabus Master Playlist',
            isPlaylist: true,
            duration: 'Full Playlist (All Modules)',
            moduleId: undefined,
          };
        }
        return y;
      });
    if (!subjectId) return cleaned;
    return cleaned.filter((y) => y.subjectId === subjectId);
  }

  static addYouTubeResource(resource: Omit<YouTubeResource, 'id' | 'createdAt'>): YouTubeResource {
    const list = this.getYouTubeResources();
    const newRes: YouTubeResource = {
      ...resource,
      id: `yt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.YOUTUBE, [newRes, ...list]);
    return newRes;
  }

  static updateYouTubeResource(id: string, updated: Partial<YouTubeResource>): void {
    const list = this.getYouTubeResources().map((y) => (y.id === id ? { ...y, ...updated } : y));
    this.set(STORAGE_KEYS.YOUTUBE, list);
  }

  static deleteYouTubeResource(id: string): void {
    const list = this.getYouTubeResources().filter((y) => y.id !== id);
    this.set(STORAGE_KEYS.YOUTUBE, list);
  }

  // --- Flashcard Decks ---
  static getFlashcardDecks(subjectId?: string): FlashcardDeck[] {
    const all = this.get<FlashcardDeck[]>(STORAGE_KEYS.DECKS, INITIAL_FLASHCARD_DECKS);
    if (!subjectId) return all;
    return all.filter((d) => d.subjectId === subjectId);
  }

  static addFlashcardDeck(deck: Omit<FlashcardDeck, 'id' | 'createdAt'>): FlashcardDeck {
    const decks = this.get<FlashcardDeck[]>(STORAGE_KEYS.DECKS, INITIAL_FLASHCARD_DECKS);
    const newDeck: FlashcardDeck = {
      ...deck,
      id: `deck-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.DECKS, [...decks, newDeck]);
    return newDeck;
  }

  static updateFlashcardDeck(id: string, updated: Partial<FlashcardDeck>): void {
    const decks = this.getFlashcardDecks().map((d) => (d.id === id ? { ...d, ...updated } : d));
    this.set(STORAGE_KEYS.DECKS, decks);
  }

  static deleteDeck(id: string): void {
    const decks = this.get<FlashcardDeck[]>(STORAGE_KEYS.DECKS, INITIAL_FLASHCARD_DECKS).filter((d) => d.id !== id);
    this.set(STORAGE_KEYS.DECKS, decks);
  }

  // --- Diagrams ---
  static getDiagrams(subjectId?: string): MermaidDiagram[] {
    const all = this.get<MermaidDiagram[]>(STORAGE_KEYS.DIAGRAMS, INITIAL_DIAGRAMS);
    if (!subjectId) return all;
    return all.filter((d) => d.subjectId === subjectId);
  }

  static addDiagram(diagram: Omit<MermaidDiagram, 'id' | 'createdAt'>): MermaidDiagram {
    const diagrams = this.get<MermaidDiagram[]>(STORAGE_KEYS.DIAGRAMS, INITIAL_DIAGRAMS);
    const newDiag: MermaidDiagram = {
      ...diagram,
      id: `diag-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.DIAGRAMS, [...diagrams, newDiag]);
    return newDiag;
  }

  static updateDiagram(id: string, updated: Partial<MermaidDiagram>): void {
    const diagrams = this.getDiagrams().map((diag) => (diag.id === id ? { ...diag, ...updated } : diag));
    this.set(STORAGE_KEYS.DIAGRAMS, diagrams);
  }

  static deleteDiagram(id: string): void {
    const diagrams = this.get<MermaidDiagram[]>(STORAGE_KEYS.DIAGRAMS, INITIAL_DIAGRAMS).filter((d) => d.id !== id);
    this.set(STORAGE_KEYS.DIAGRAMS, diagrams);
  }

  // --- Attendance ---
  static getAttendanceCourses(): AttendanceCourse[] {
    const initial: AttendanceCourse[] = [
      {
        id: 'att-1',
        userId: 'usr-fy-student-1',
        subjectName: 'Applied Mathematics – I',
        subjectCode: '316U06C101',
        totalConducted: 26,
        totalAttended: 22,
        targetPercentage: 75,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'att-2',
        userId: 'usr-fy-student-1',
        subjectName: 'Engineering Physics',
        subjectCode: '316U06C102',
        totalConducted: 24,
        totalAttended: 19,
        targetPercentage: 75,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'att-3',
        userId: 'usr-fy-student-1',
        subjectName: 'Engineering Chemistry',
        subjectCode: '316U06C103',
        totalConducted: 20,
        totalAttended: 17,
        targetPercentage: 75,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'att-4',
        userId: 'usr-fy-student-1',
        subjectName: 'Basic Electrical Engineering',
        subjectCode: '316U06C104',
        totalConducted: 28,
        totalAttended: 24,
        targetPercentage: 75,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'att-5',
        userId: 'usr-fy-student-1',
        subjectName: 'Engineering Drawing',
        subjectCode: '316U06C105',
        totalConducted: 22,
        totalAttended: 18,
        targetPercentage: 75,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'att-6',
        userId: 'usr-fy-student-1',
        subjectName: 'Biology for Engineers',
        subjectCode: '316U06C106',
        totalConducted: 20,
        totalAttended: 16,
        targetPercentage: 75,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'att-7',
        userId: 'usr-fy-student-1',
        subjectName: 'Structured Programming Methodology',
        subjectCode: '316U06C107',
        totalConducted: 25,
        totalAttended: 21,
        targetPercentage: 75,
        updatedAt: new Date().toISOString(),
      }
    ];
    return this.get<AttendanceCourse[]>(STORAGE_KEYS.ATTENDANCE, initial);
  }

  static setAttendanceRecords(records: AttendanceCourse[]): void {
    this.set(STORAGE_KEYS.ATTENDANCE, records);
  }

  static saveAttendanceCourse(course: Omit<AttendanceCourse, 'id' | 'updatedAt'> & { id?: string }): void {
    const list = this.getAttendanceCourses();
    const now = new Date().toISOString();
    let updatedList: AttendanceCourse[];
    if (course.id) {
      updatedList = list.map((c) => (c.id === course.id ? { ...course, id: course.id, updatedAt: now } : c));
    } else {
      const newItem: AttendanceCourse = {
        ...course,
        id: `att-${Date.now()}`,
        updatedAt: now,
      };
      updatedList = [...list, newItem];
    }
    this.set(STORAGE_KEYS.ATTENDANCE, updatedList);

    const currentUser = this.getCurrentUser();
    if (currentUser && typeof window !== 'undefined') {
      import('./firebase-services').then(({ saveAttendanceToCloud }) => {
        saveAttendanceToCloud(currentUser.id, updatedList);
      }).catch((e) => console.warn('Cloud attendance sync error:', e));
    }
  }

  static deleteAttendanceCourse(id: string): void {
    const list = this.getAttendanceCourses().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.ATTENDANCE, list);

    const currentUser = this.getCurrentUser();
    if (currentUser && typeof window !== 'undefined') {
      import('./firebase-services').then(({ saveAttendanceToCloud }) => {
        saveAttendanceToCloud(currentUser.id, list);
      }).catch((e) => console.warn('Cloud attendance sync error:', e));
    }
  }

  // --- CGPA Records ---
  static getCgpaRecords(): CgpaRecord[] {
    const initial: CgpaRecord[] = [
      {
        id: 'cgpa-sem1',
        userId: 'usr-fy-student-1',
        semester: 1,
        sgpa: 9.33,
        totalCredits: 18,
        courseBreakdown: [
          { courseName: 'Applied Mathematics – I', courseCode: '316U06C101', credits: 4, grade: 'O', gradePoints: 10 },
          { courseName: 'Engineering Physics', courseCode: '316U06C102', credits: 2, grade: 'A+', gradePoints: 9 },
          { courseName: 'Engineering Chemistry', courseCode: '316U06C103', credits: 2, grade: 'A+', gradePoints: 9 },
          { courseName: 'Basic Electrical Engineering', courseCode: '316U06C104', credits: 2, grade: 'O', gradePoints: 10 },
          { courseName: 'Engineering Drawing', courseCode: '316U06C105', credits: 3, grade: 'A+', gradePoints: 9 },
          { courseName: 'Biology for Engineers', courseCode: '316U06C106', credits: 2, grade: 'A', gradePoints: 8 },
          { courseName: 'Structured Programming Methodology', courseCode: '316U06C107', credits: 3, grade: 'O', gradePoints: 10 },
        ],
        updatedAt: new Date().toISOString(),
      }
    ];
    return this.get<CgpaRecord[]>(STORAGE_KEYS.CGPA, initial);
  }

  static saveCgpaRecord(record: CgpaRecord): void {
    const list = this.getCgpaRecords();
    const existingIdx = list.findIndex((r) => r.semester === record.semester);
    if (existingIdx >= 0) {
      list[existingIdx] = record;
      this.set(STORAGE_KEYS.CGPA, [...list]);
    } else {
      this.set(STORAGE_KEYS.CGPA, [...list, record]);
    }
  }

  // --- AI Syllabus Bulk Import ---
  static importParsedSyllabus(parsed: SyllabusParseResult): { subjectId: string; moduleIdCount: number } {
    // Add Subject for Sem 1 or Sem 2
    const subject = this.addSubject({
      semester: (parsed.semester === 2 ? 2 : 1) as 1 | 2,
      code: parsed.subjectCode || 'BSC105',
      name: parsed.subjectName.replace(/\s*\(\s*2025\s*Rev\s*\)/gi, '').trim(),
      scheme: parsed.scheme || 'REV_2025',
      credits: parsed.credits || 4,
      hasLab: parsed.hasLab || false,
      description: `First Year common course for ${parsed.subjectName}.`,
    });

    // Add Modules
    parsed.modules.forEach((mod) => {
      this.addModule({
        subjectId: subject.id,
        moduleNumber: mod.moduleNumber,
        title: mod.title,
        description: mod.description,
        topics: mod.topics,
        weightageMarks: mod.weightageMarks,
      });
    });

    return {
      subjectId: subject.id,
      moduleIdCount: parsed.modules.length,
    };
  }
}
