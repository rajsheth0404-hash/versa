export type UserRole = 'student' | 'faculty' | 'admin';

export type RevisionScheme = 'REV_2019' | 'REV_2024' | 'REV_2025';

export type ResourceType = 
  | 'notes' 
  | 'ppt' 
  | 'practice_ques'
  | 'pyq' 
  | 'formula_sheet' 
  | 'pdf' 
  | 'syllabus' 
  | 'reference_book';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  currentSemester: 1 | 2; // First Year Sem 1 & Sem 2
  createdAt: string;
}

export interface Subject {
  id: string;
  semester: number; // Sem 1 & 2 (FY), Sem 3 & 4 (SY)
  code: string; // e.g. 'BSC101'
  name: string;
  category?: string; // e.g. 'BSC' | 'ESC' | 'PCC' | 'HSMC' | 'VSEC' | 'AEC'
  scheme: RevisionScheme;
  credits: number;
  theoryCredits?: number;
  practicalCredits?: number;
  tutorialCredits?: number;
  hasLab: boolean;
  description?: string;
  thumbnailUrl?: string;
  iconName?: string;
}

export interface Module {
  id: string;
  subjectId: string;
  moduleNumber: number;
  title: string;
  description?: string;
  topics?: string[];
  weightageMarks?: number;
}

export interface AcademicResource {
  id: string;
  subjectId: string;
  moduleId?: string; // Optional for subject-wide PYQs
  title: string;
  type: ResourceType;
  examType?: 'mid_sem' | 'end_sem' | 'in_sem'; // For PYQ Exam Papers
  examYear?: string; // e.g. '2024-25', '2023-24', '2022-23'
  filePath: string;
  fileName: string;
  fileSizeBytes?: number;
  fileMime?: string;
  academicYear: string;
  scheme: RevisionScheme;
  uploaderName?: string;
  isVerified: boolean;
  downloadsCount: number;
  tags?: string[];
  createdAt: string;
}

export interface YouTubeResource {
  id: string;
  subjectId: string;
  moduleId?: string;
  title: string;
  channelName: string;
  youtubeUrl: string;
  videoId: string; // 11 char video ID or playlist ID
  isPlaylist?: boolean;
  playlistId?: string;
  duration?: string;
  description?: string;
  tags: string[];
  customThumbnail?: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashcardDeck {
  id: string;
  subjectId: string;
  moduleId?: string;
  title: string;
  description?: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface MermaidDiagram {
  id: string;
  subjectId: string;
  moduleId?: string;
  title: string;
  diagramType: 'flowchart' | 'mindmap' | 'sequence' | 'architecture';
  mermaidCode: string;
  explanation: string;
  createdAt: string;
}

export interface AttendanceCourse {
  id: string;
  userId: string;
  subjectName: string;
  subjectCode?: string;
  totalConducted: number;
  totalAttended: number;
  targetPercentage: number; // default 75.00
  updatedAt: string;
}

export interface CourseGrade {
  courseName: string;
  courseCode: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';
  gradePoints: number;
}

export interface CgpaRecord {
  id: string;
  userId: string;
  semester: number;
  sgpa: number;
  totalCredits: number;
  courseBreakdown: CourseGrade[];
  updatedAt: string;
}

export interface SyllabusParseResult {
  semester: 1 | 2;
  subjectCode: string;
  subjectName: string;
  scheme: RevisionScheme;
  credits: number;
  hasLab: boolean;
  modules: {
    moduleNumber: number;
    title: string;
    description: string;
    topics: string[];
    weightageMarks: number;
  }[];
}
