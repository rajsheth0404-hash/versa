'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Play,
  Tv,
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  BookOpen,
  Sparkles,
  Clock,
  User,
  ListVideo,
  Video,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { Subject, Module, YouTubeResource, UserProfile } from '@/lib/types';
import confetti from 'canvas-confetti';

// Helper to extract 11-char video ID or playlist ID from standard YouTube URLs
function extractYouTubeVideoId(url: string): { videoId: string; playlistId?: string } {
  try {
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return { videoId: trimmed };
    }

    const parsedUrl = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const vParam = parsedUrl.searchParams.get('v');
    const listParam = parsedUrl.searchParams.get('list');

    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
      return { videoId: vParam, playlistId: listParam || undefined };
    }

    if (parsedUrl.hostname === 'youtu.be' || parsedUrl.hostname.endsWith('.youtu.be')) {
      const id = parsedUrl.pathname.slice(1).split('/')[0].split('?')[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return { videoId: id, playlistId: listParam || undefined };
      }
    }

    if (parsedUrl.pathname.includes('/embed/')) {
      const id = parsedUrl.pathname.split('/embed/')[1]?.split('?')[0]?.split('/')[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return { videoId: id, playlistId: listParam || undefined };
      }
    }

    if (parsedUrl.pathname.includes('/shorts/')) {
      const id = parsedUrl.pathname.split('/shorts/')[1]?.split('?')[0]?.split('/')[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return { videoId: id, playlistId: listParam || undefined };
      }
    }

    if (listParam) {
      return { videoId: vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam) ? vParam : '', playlistId: listParam };
    }

    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return { videoId: match[1], playlistId: listParam || undefined };
    }

    return { videoId: 'kYB8IZa55bM', playlistId: listParam || undefined };
  } catch {
    return { videoId: 'kYB8IZa55bM' };
  }
}

type UploadTargetKind = 'subject_master' | 'module_playlist' | 'module_video';

interface PlaylistLectureItem {
  id: string;
  lessonNumber: number;
  title: string;
  duration: string;
  videoId: string;
  playlistId?: string;
  youtubeUrl?: string;
  channelName: string;
  moduleTitle?: string;
  isPlaylist?: boolean;
}

export default function YouTubeResourcesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [videos, setVideos] = useState<YouTubeResource[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Filters: First Year / Second Year and Semesters 1 to 4
  const [selectedYear, setSelectedYear] = useState<1 | 2>(1);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active playing video / playlist state
  const [activeVideo, setActiveVideo] = useState<YouTubeResource | null>(null);
  const [selectedPlaylistItemIndex, setSelectedPlaylistItemIndex] = useState<number>(0);

  // Admin Add Video Modal State
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [uploadKind, setUploadKind] = useState<UploadTargetKind>('module_playlist');
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputChannel, setInputChannel] = useState('');
  const [inputSubjectId, setInputSubjectId] = useState('');
  const [inputModuleId, setInputModuleId] = useState('');
  const [inputDuration, setInputDuration] = useState('');
  const [inputTags, setInputTags] = useState('Lecture, Solved Numericals');

  // Admin Edit Video Modal State
  const [editingVideo, setEditingVideo] = useState<YouTubeResource | null>(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const loadData = () => {
    const subs = HubStore.getSubjects();
    setSubjects(subs);
    setModules(HubStore.getModules());
    setVideos(HubStore.getYouTubeResources());
    setCurrentUser(HubStore.getCurrentUser());

    const semSubs = subs.filter((s) => s.semester === (selectedSemester <= 2 ? selectedSemester : 1));
    if (semSubs.length > 0 && !inputSubjectId) {
      setInputSubjectId(semSubs[0].id);
    }
  };

  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => s.semester === (selectedSemester <= 2 ? selectedSemester : 1));
  }, [subjects, selectedSemester]);

  // Modules for current active subject filter (or all modules in sem)
  const availableFilterModules = useMemo(() => {
    if (selectedSubject === 'all') return [];
    return modules.filter((m) => m.subjectId === selectedSubject);
  }, [modules, selectedSubject]);

  const availableModulesForInput = useMemo(() => {
    if (!inputSubjectId) return [];
    return modules.filter((m) => m.subjectId === inputSubjectId);
  }, [modules, inputSubjectId]);

  // Authors / Instructors available in the selected subject or semester
  const availableAuthors = useMemo(() => {
    const list = videos.filter((v) => {
      const sub = subjects.find((s) => s.id === v.subjectId);
      if (!sub || sub.semester !== selectedSemester) return false;
      if (selectedSubject !== 'all' && v.subjectId !== selectedSubject) return false;
      return true;
    });
    return Array.from(new Set(list.map((v) => v.channelName))).filter(Boolean);
  }, [videos, subjects, selectedSemester, selectedSubject]);

  // Filtered module-specific or general videos (strictly in module order 1 to 5)
  const filteredVideos = useMemo(() => {
    const list = videos.filter((v) => {
      const sub = subjects.find((s) => s.id === v.subjectId);
      if (!sub || sub.semester !== selectedSemester) return false;

      if (selectedSubject !== 'all' && v.subjectId !== selectedSubject) {
        return false;
      }

      if (selectedModule !== 'all' && v.moduleId !== selectedModule) {
        return false;
      }

      if (selectedAuthor !== 'all' && v.channelName !== selectedAuthor) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mod = modules.find((m) => m.id === v.moduleId);
        const matches =
          v.title.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q) ||
          v.tags?.some((t) => t.toLowerCase().includes(q)) ||
          sub.name.toLowerCase().includes(q) ||
          (mod?.title.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      // 1. Group by Subject if viewing All subjects
      if (a.subjectId !== b.subjectId) {
        const subA = subjects.find((s) => s.id === a.subjectId);
        const subB = subjects.find((s) => s.id === b.subjectId);
        const codeA = subA?.code || a.subjectId;
        const codeB = subB?.code || b.subjectId;
        return codeA.localeCompare(codeB);
      }

      // 2. Full Course / Master Playlist MUST BE TOPMOST (-1)
      const isFullCourseA = !a.moduleId || !modules.some((m) => m.id === a.moduleId);
      const isFullCourseB = !b.moduleId || !modules.some((m) => m.id === b.moduleId);

      const modA = a.moduleId ? modules.find((m) => m.id === a.moduleId) : null;
      const modB = b.moduleId ? modules.find((m) => m.id === b.moduleId) : null;

      const rankA = isFullCourseA ? -1 : (modA ? modA.moduleNumber : 99);
      const rankB = isFullCourseB ? -1 : (modB ? modB.moduleNumber : 99);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // 3. Playlists come before individual videos
      if (a.isPlaylist !== b.isPlaylist) {
        return a.isPlaylist ? -1 : 1;
      }

      return a.title.localeCompare(b.title, undefined, { numeric: true });
    });
  }, [videos, subjects, modules, selectedSemester, selectedSubject, selectedModule, selectedAuthor, searchQuery]);

  // Playlist video list resolver: strictly resolves and sorts all videos/playlists for this subject in module order 1 to 5
  const activePlaylistVideos = useMemo<PlaylistLectureItem[]>(() => {
    if (!activeVideo) return [];

    const subjectVideos = videos.filter((v) => {
      if (v.subjectId !== activeVideo.subjectId) return false;
      // If active video has a specific channel, keep that author's series grouped
      if (activeVideo.channelName && v.channelName && activeVideo.subjectId === 'sub-phy') {
        return v.channelName === activeVideo.channelName;
      }
      return true;
    });

    const sorted = [...subjectVideos].sort((a, b) => {
      const isFullCourseA = !a.moduleId || !modules.some((m) => m.id === a.moduleId);
      const isFullCourseB = !b.moduleId || !modules.some((m) => m.id === b.moduleId);

      const modA = a.moduleId ? modules.find((m) => m.id === a.moduleId) : null;
      const modB = b.moduleId ? modules.find((m) => m.id === b.moduleId) : null;

      const rankA = isFullCourseA ? -1 : (modA ? modA.moduleNumber : 99);
      const rankB = isFullCourseB ? -1 : (modB ? modB.moduleNumber : 99);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      if (a.isPlaylist !== b.isPlaylist) {
        return a.isPlaylist ? -1 : 1;
      }

      return a.title.localeCompare(b.title, undefined, { numeric: true });
    });

    return sorted.map((v, idx) => {
      const mod = modules.find((m) => m.id === v.moduleId);
      return {
        id: v.id,
        lessonNumber: idx + 1,
        title: v.title,
        duration: v.duration || (v.isPlaylist ? 'Full Playlist' : 'Lecture Video'),
        videoId: v.videoId || '',
        playlistId: v.playlistId,
        youtubeUrl: v.youtubeUrl,
        channelName: v.channelName,
        moduleTitle: mod ? `Mod ${mod.moduleNumber}: ${mod.title}` : 'Full Subject Series',
        isPlaylist: v.isPlaylist,
      };
    });
  }, [activeVideo, videos, modules]);

  const handleOpenAddModal = (kind: UploadTargetKind = 'module_playlist', subjectId?: string) => {
    setUploadKind(kind);
    if (subjectId) {
      setInputSubjectId(subjectId);
    } else if (availableSubjects.length > 0) {
      setInputSubjectId(availableSubjects[0].id);
    }
    setInputModuleId('');
    setInputUrl('');
    setInputTitle('');
    setInputChannel('');
    setInputDuration('');
    setIsAddingVideo(true);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputTitle || !inputSubjectId) return;

    const { videoId, playlistId } = extractYouTubeVideoId(inputUrl);
    const tagsArray = inputTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const isPlaylist = uploadKind === 'subject_master' || uploadKind === 'module_playlist' || !!playlistId;

    HubStore.addYouTubeResource({
      subjectId: inputSubjectId,
      moduleId: uploadKind === 'subject_master' ? undefined : inputModuleId || undefined,
      title: inputTitle,
      channelName: inputChannel || 'Official Department Faculty',
      youtubeUrl: inputUrl,
      videoId: videoId || (playlistId ? '' : 'kYB8IZa55bM'),
      playlistId: playlistId,
      isPlaylist: isPlaylist,
      duration: inputDuration || (isPlaylist ? 'Full Playlist' : '25:00'),
      tags: tagsArray,
      customThumbnail: undefined,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#10B981', '#34D399', '#A3E635'] });
    setIsAddingVideo(false);
    loadData();
  };

  const handleStartWatching = (video: YouTubeResource) => {
    setActiveVideo(video);

    // Determine target index in sorted module order
    const subjectVideos = videos.filter((v) => v.subjectId === video.subjectId);
    const sorted = [...subjectVideos].sort((a, b) => {
      const modA = a.moduleId ? modules.find((m) => m.id === a.moduleId) : null;
      const modB = b.moduleId ? modules.find((m) => m.id === b.moduleId) : null;

      const numA = modA ? modA.moduleNumber : (a.isPlaylist ? 0 : 99);
      const numB = modB ? modB.moduleNumber : (b.isPlaylist ? 0 : 99);

      if (numA !== numB) {
        return numA - numB;
      }
      return a.title.localeCompare(b.title);
    });

    const foundIdx = sorted.findIndex((v) => v.id === video.id);
    setSelectedPlaylistItemIndex(foundIdx >= 0 ? foundIdx : 0);
  };

  const handleSelectPlaylistItem = (index: number) => {
    setSelectedPlaylistItemIndex(index);
  };

  const handleNextPlaylistItem = () => {
    if (selectedPlaylistItemIndex < activePlaylistVideos.length - 1) {
      setSelectedPlaylistItemIndex((prev) => prev + 1);
    }
  };

  const handlePrevPlaylistItem = () => {
    if (selectedPlaylistItemIndex > 0) {
      setSelectedPlaylistItemIndex((prev) => prev - 1);
    }
  };

  const handleSaveEditVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    const { videoId, playlistId } = extractYouTubeVideoId(editingVideo.youtubeUrl);

    HubStore.updateYouTubeResource(editingVideo.id, {
      title: editingVideo.title,
      channelName: editingVideo.channelName,
      youtubeUrl: editingVideo.youtubeUrl,
      videoId: videoId,
      playlistId: playlistId,
      duration: editingVideo.duration,
      tags: editingVideo.tags,
      moduleId: editingVideo.moduleId || undefined,
      subjectId: editingVideo.subjectId,
    });

    setEditingVideo(null);
    loadData();
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Are you sure you want to delete this video lecture / playlist button?')) {
      HubStore.deleteYouTubeResource(id);
      loadData();
    }
  };

  const currentPlayingItem = activePlaylistVideos[selectedPlaylistItemIndex] || (activeVideo ? {
    id: activeVideo.id,
    lessonNumber: 1,
    title: activeVideo.title,
    duration: activeVideo.duration || 'Lecture Video',
    videoId: activeVideo.videoId || '',
    playlistId: activeVideo.playlistId,
    youtubeUrl: activeVideo.youtubeUrl,
    channelName: activeVideo.channelName,
    isPlaylist: activeVideo.isPlaylist,
  } : null);

  // Helper to build reliable iframe embed URLs for single videos and full playlists
  const getEmbedUrl = (item: PlaylistLectureItem | null) => {
    if (!item) return '';

    if (item.playlistId && item.playlistId.length >= 5 && !item.playlistId.startsWith('PLm_MSClsnwm')) {
      return `https://www.youtube.com/embed/videoseries?list=${item.playlistId}&autoplay=1&rel=0`;
    }

    if (item.youtubeUrl) {
      const extracted = extractYouTubeVideoId(item.youtubeUrl);
      if (extracted.playlistId && extracted.playlistId.length >= 5 && !extracted.playlistId.startsWith('PLm_MSClsnwm')) {
        return `https://www.youtube.com/embed/videoseries?list=${extracted.playlistId}&autoplay=1&rel=0`;
      }
      if (extracted.videoId && extracted.videoId.length === 11 && !['1b9iU19bJ8E', 'kYB8IZa55bM', '34dOqQ9kF10', 'E6x7WJ8m5l0', '9_j3i0c7P-s', 'F01VpGZtVbY'].includes(extracted.videoId)) {
        return `https://www.youtube.com/embed/${extracted.videoId}?autoplay=1&rel=0`;
      }
    }

    if (item.videoId && item.videoId.length === 11 && !['1b9iU19bJ8E', 'kYB8IZa55bM', '34dOqQ9kF10', 'E6x7WJ8m5l0', '9_j3i0c7P-s', 'F01VpGZtVbY', 'videoseries'].includes(item.videoId)) {
      return `https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`;
    }

    return `https://www.youtube.com/embed/wH2uY-n5_sQ?autoplay=1&rel=0`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300 min-h-screen">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-xs font-semibold mb-2">
            <Tv className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Syllabus-Aligned Video Lectures • Semester {selectedSemester}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F0FDF4] tracking-tight">
            Video Lectures & Master Playlists
          </h1>
          <p className="text-xs text-[#86998A] mt-1">
            Curated YouTube playlists, solved numericals, and step-by-step topic lectures.
          </p>
        </div>

        {/* Global Action: Add Lecture / Playlist Button */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => handleOpenAddModal('module_playlist')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold shadow-md shadow-emerald-950/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Module Video / Playlist</span>
          </button>
        </div>
      </div>

      {/* Year Selector: First Year / Second Year */}
      <div className="flex flex-col items-start justify-start gap-2.5">
        <div className="flex bg-[#0F1410] p-1.5 rounded-2xl border border-[#1C271E] shadow-sm gap-1">
          <button
            onClick={() => {
              setSelectedYear(1);
              setSelectedSemester(1);
              setSelectedSubject('all');
              setSelectedModule('all');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              selectedYear === 1
                ? 'bg-[#10B981] text-black shadow-sm font-extrabold'
                : 'text-[#86998A] hover:text-[#F0FDF4]'
            }`}
          >
            <span>First Year</span>
          </button>
          <button
            onClick={() => {
              setSelectedYear(2);
              setSelectedSemester(3);
              setSelectedSubject('all');
              setSelectedModule('all');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              selectedYear === 2
                ? 'bg-[#10B981] text-black shadow-sm font-extrabold'
                : 'text-[#86998A] hover:text-[#F0FDF4]'
            }`}
          >
            <span>Second Year</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
              Soon
            </span>
          </button>
        </div>

        {/* Nested Semester Selector for Selected Year */}
        {selectedYear === 1 ? (
          <div className="flex bg-[#0F1410] p-1 rounded-xl border border-[#1C271E] shadow-sm mt-1 animate-in fade-in">
            <button
              onClick={() => {
                setSelectedSemester(1);
                setSelectedSubject('all');
                setSelectedModule('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 1
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 1 Video Catalog (7 Subjects)
            </button>
            <button
              onClick={() => {
                setSelectedSemester(2);
                setSelectedSubject('all');
                setSelectedModule('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 2
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 2 Video Catalog (5 Subjects)
            </button>
          </div>
        ) : (
          <div className="flex bg-[#0F1410] p-1 rounded-xl border border-[#1C271E] shadow-sm mt-1 animate-in fade-in">
            <button
              onClick={() => {
                setSelectedSemester(3);
                setSelectedSubject('all');
                setSelectedModule('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 3
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 3 Courses
            </button>
            <button
              onClick={() => {
                setSelectedSemester(4);
                setSelectedSubject('all');
                setSelectedModule('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 4
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 4 Courses
            </button>
          </div>
        )}
      </div>

      {selectedYear === 2 ? (
        /* Year 2: Video lectures to be added soon Container */
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-12 sm:p-16 rounded-3xl text-center border border-dashed border-[#1C271E] space-y-5 shadow-2xl max-w-2xl mx-auto my-8 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8 text-[#34D399]" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[11px] font-mono font-bold uppercase tracking-wider">
              <span>Second Year • Semester {selectedSemester}</span>
            </div>
            <h3 className="font-extrabold text-[#F0FDF4] text-2xl sm:text-3xl tracking-tight">
              Notes to be added soon
            </h3>
            <p className="text-xs sm:text-sm text-[#86998A] max-w-md mx-auto leading-relaxed">
              Curated YouTube playlists, solved numericals, and step-by-step topic video lectures for Second Year are currently being compiled.
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setSelectedYear(1);
                setSelectedSemester(1);
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition shadow-lg shadow-emerald-950/40"
            >
              <span>Explore First Year Lectures</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      ) : (
        <>

      {/* Filter Control Center */}
      <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] space-y-4 shadow-xl">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#86998A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Applied Maths matrices, BEE Thevenin, C Pointers, Lasers, Channel name, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
          />
        </div>

        {/* Faceted Dropdowns: Subject & Module */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1C271E]">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#86998A] block mb-1">
              Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedModule('all');
              }}
              className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
            >
              <option value="all">All Subjects in Semester {selectedSemester}</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Module Filter Dropdown */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#86998A] block mb-1">
              Filter by Module / Unit
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              disabled={selectedSubject === 'all'}
              className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#34D399] disabled:opacity-40"
            >
              <option value="all">
                {selectedSubject === 'all' ? 'Select a Subject first' : 'All Modules'}
              </option>
              {availableFilterModules.map((m) => (
                <option key={m.id} value={m.id}>
                  Mod {m.moduleNumber}: {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Module Quick Filter Pills */}
        {selectedSubject !== 'all' && availableFilterModules.length > 0 && (
          <div className="pt-2 border-t border-[#1C271E]">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-bold text-[#86998A] uppercase mr-1">Modules:</span>
              <button
                onClick={() => setSelectedModule('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
                  selectedModule === 'all'
                    ? 'bg-[#10B981] text-black font-bold shadow-md'
                    : 'bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E]'
                }`}
              >
                All
              </button>
              {availableFilterModules.map((m) => {
                const isSelected = selectedModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModule(isSelected ? 'all' : m.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex-shrink-0 flex items-center space-x-1.5 border ${
                      isSelected
                        ? 'bg-[#10B981] text-black border-[#10B981] font-bold shadow-md'
                        : 'bg-[#151D17] text-[#86998A] border-[#1C271E] hover:border-[#34D399] hover:text-[#F0FDF4]'
                    }`}
                  >
                    <span className="font-mono text-[10px]">M{m.moduleNumber}</span>
                    <span className="truncate max-w-[150px]">{m.title.split(' ')[0]} {m.title.split(' ')[1] || ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(searchQuery || selectedSubject !== 'all' || selectedModule !== 'all' || selectedAuthor !== 'all') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setSelectedModule('all');
                setSelectedAuthor('all');
              }}
              className="text-xs text-[#34D399] hover:underline font-semibold"
            >
              Reset active filters
            </button>
          </div>
        )}
      </div>

      {/* ⚛️ Engineering Physics Dual-Instructor Selector Banner */}
      {selectedSubject === 'sub-phy' && selectedAuthor === 'all' && (
        <div className="bg-[#0F1410]/80 backdrop-blur-md border border-[#10B981]/30 p-6 rounded-3xl space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] font-mono border border-[#10B981]/30">
                  Dual-Instructor Course
                </span>
                <h3 className="text-base font-bold text-[#F0FDF4]">Choose Your Preferred Physics Instructor</h3>
              </div>
              <p className="text-xs text-[#86998A] mt-1">
                Engineering Physics is available in two complete, high-yield playlist series. Select your favorite instructor:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Physics Jessy Card */}
            <div
              onClick={() => setSelectedAuthor('Physics Jessy')}
              className="p-4 rounded-2xl bg-[#151D17] border border-[#1C271E] hover:border-[#34D399] hover:bg-[#131A14] transition cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center font-bold">
                    PJ
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F0FDF4] text-sm group-hover:text-[#34D399] transition">Physics Jessy</h4>
                    <p className="text-[11px] text-[#86998A]">7 Playlists • Complete Module 1 to 4 Series</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-[#10B981] text-black text-xs font-bold shadow group-hover:scale-105 transition">
                  Watch Series
                </button>
              </div>
              <p className="text-[11px] text-[#86998A] leading-snug">
                Covers Thin Film Interference, Diffraction, Lasers, Optical Fibers, Quantum Mechanics, Semiconductors &amp; Electrodynamics.
              </p>
            </div>

            {/* Engineering Physics by Sanjiv Card */}
            <div
              onClick={() => setSelectedAuthor('Engineering Physics by Sanjiv')}
              className="p-4 rounded-2xl bg-[#151D17] border border-[#1C271E] hover:border-[#34D399] hover:bg-[#131A14] transition cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center font-bold">
                    ES
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F0FDF4] text-sm group-hover:text-[#34D399] transition">Engineering Physics by Sanjiv</h4>
                    <p className="text-[11px] text-[#86998A]">7 Playlists • Dr. Sanjiv Lecture Series</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-[#10B981] text-black text-xs font-bold shadow group-hover:scale-105 transition">
                  Watch Series
                </button>
              </div>
              <p className="text-[11px] text-[#86998A] leading-snug">
                Step-by-step solved derivations on Diffraction, Interference, Laser, Fiber Optics, Quantum, Semiconductors &amp; Maxwell Laws.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📘 Biology for Engineers Subject Notice Banner */}
      {selectedSubject === 'sub-bio' && (
        <div className="bg-[#0F1410]/80 backdrop-blur-md border border-[#10B981]/30 p-6 rounded-3xl space-y-3 shadow-xl animate-in fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] font-mono border border-[#10B981]/30">
                  316U06C106
                </span>
                <h3 className="text-base font-bold text-[#F0FDF4]">Biology for Engineers</h3>
              </div>
              <p className="text-xs text-[#86998A] leading-relaxed max-w-2xl">
                There is no official YouTube video playlist needed for Biology for Engineers. Please refer to the Notes &amp; Materials section for complete faculty notes.
              </p>
              <div className="pt-2">
                <Link
                  href="/resources?subject=sub-bio"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition shadow-lg shadow-emerald-950/40"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Refer to Notes &amp; Materials Section</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌿 Environmental Science (EVS) Subject Notice Banner */}
      {selectedSubject === 'sub-evs' && (
        <div className="bg-[#0F1410]/80 backdrop-blur-md border border-[#10B981]/30 p-6 rounded-3xl space-y-3 shadow-xl animate-in fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] font-mono border border-[#10B981]/30">
                  316U06C204 • HSS
                </span>
                <h3 className="text-base font-bold text-[#F0FDF4]">Environmental Science (EVS)</h3>
              </div>
              <p className="text-xs text-[#86998A] leading-relaxed max-w-2xl">
                There is no need to watch YouTube video lectures for Environmental Science. The curriculum is theory &amp; reading-focused — please follow the lecture notes, presentations, and syllabus materials directly.
              </p>
              <div className="pt-2">
                <Link
                  href="/resources?subject=sub-evs"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition shadow-lg shadow-emerald-950/40"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Refer to EVS Notes &amp; Materials Section</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔬 Applied Science for Computer & Allied Programs (ASCT) Subject Notice Banner */}
      {selectedSubject === 'sub-ascap' && (
        <div className="bg-[#0F1410]/80 backdrop-blur-md border border-[#10B981]/30 p-6 rounded-3xl space-y-3 shadow-xl animate-in fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] font-mono border border-[#10B981]/30">
                  316U06E211 • BS
                </span>
                <h3 className="text-base font-bold text-[#F0FDF4]">Applied Science for Computer &amp; Allied Programs (ASCT)</h3>
              </div>
              <p className="text-xs text-[#86998A] leading-relaxed max-w-2xl">
                There is no need to watch YouTube video playlists for ASCT. Just follow the Academic Resources, reference notes, and textbook question banks directly.
              </p>
              <div className="pt-2">
                <Link
                  href="/resources?subject=sub-ascap"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition shadow-lg shadow-emerald-950/40"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Follow ASCT Resources &amp; Notes</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid (Obsidian & Electric Mint Layout) */}
      {filteredVideos.length === 0 ? (
        selectedSubject === 'sub-bio' || selectedSubject === 'sub-evs' || selectedSubject === 'sub-ascap' ? null : selectedSubject === 'sub-spm' && selectedModule !== 'all' ? (
          <div className="bg-[#0F1410]/80 backdrop-blur-md p-12 rounded-3xl text-center border border-[#10B981]/30 space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-bold text-[#F0FDF4] text-base">Structured Programming Methodology (C++)</h3>
              <p className="text-xs text-[#86998A] leading-relaxed">
                For this module section, refer to the <strong>Notes</strong> section or stream the <strong>Entire Course Playlist</strong> covering all modules.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <Link
                href="/resources?subject=sub-spm"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#151D17] hover:bg-[#131A14] text-[#F0FDF4] border border-[#1C271E] font-semibold text-xs transition"
              >
                <BookOpen className="w-4 h-4 text-[#34D399]" />
                <span>Refer to SPM Notes Section</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#0F1410]/80 backdrop-blur-md p-16 rounded-3xl text-center text-[#86998A] border border-[#1C271E] space-y-3">
            <Tv className="w-12 h-12 mx-auto text-[#627766]" />
            <h3 className="font-bold text-[#F0FDF4] text-base">No video resources found</h3>
            <p className="text-xs text-[#86998A] max-w-sm mx-auto">
              Click &ldquo;+ Add Module Video / Playlist&rdquo; to add YouTube lectures.
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const sub = subjects.find((s) => s.id === video.subjectId);
            const mod = modules.find((m) => m.id === video.moduleId);

            return (
              <div
                key={video.id}
                className="bg-[#0F1410]/80 backdrop-blur-md rounded-3xl p-5 border border-[#1C271E] flex flex-col justify-between group hover:border-[#34D399] hover:bg-[#131A14] hover:shadow-2xl transition-all duration-300 relative"
              >
                <div className="space-y-3">
                  {/* Card Top Header: Play Icon Badge, Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => handleStartWatching(video)}
                      className="w-11 h-11 rounded-2xl bg-[#10B981] text-black flex items-center justify-center shadow-lg group-hover:scale-105 cursor-pointer transition-transform flex-shrink-0 font-black"
                      title="Play Lecture"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>

                    <div className="flex items-center space-x-1.5 flex-wrap justify-end">
                      <span className="px-2 py-0.5 rounded-lg bg-[#151D17] text-[10px] font-mono font-bold text-[#F0FDF4] border border-[#1C271E]">
                        {sub?.code || 'Course'}
                      </span>
                      {mod ? (
                        <span className="px-2 py-0.5 rounded-lg bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[10px] font-mono font-bold">
                          Mod {mod.moduleNumber}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 text-[10px] font-bold">
                          Full Course
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-lg bg-[#151D17] text-[#86998A] border border-[#1C271E] text-[10px] font-semibold flex items-center space-x-1">
                        {video.isPlaylist ? (
                          <>
                            <ListVideo className="w-3 h-3 text-[#34D399]" />
                            <span>Playlist</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-[#86998A]" />
                            <span>{video.duration || 'Video'}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      onClick={() => handleStartWatching(video)}
                      className="font-bold text-[#F0FDF4] text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#34D399] transition"
                    >
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-[11px] text-[#86998A] mt-1.5 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  {/* Channel info */}
                  <div className="flex items-center space-x-1.5 text-xs text-[#86998A] pt-0.5">
                    <User className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="truncate font-medium">{video.channelName}</span>
                  </div>

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {video.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#151D17] text-[#86998A] border border-[#1C271E] font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 mt-4 border-t border-[#1C271E] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStartWatching(video)}
                    className="flex-1 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center justify-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{video.isPlaylist ? 'Play Playlist' : 'Watch Lecture'}</span>
                  </button>

                  <button
                    onClick={() => setEditingVideo(video)}
                    className="p-2 rounded-xl bg-[#151D17] hover:bg-[#1C271E] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] transition"
                    title="Edit Video Information"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="p-2 rounded-xl bg-[#151D17] hover:bg-rose-500/20 hover:text-rose-400 text-[#86998A] border border-[#1C271E] transition"
                    title="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 💡 Structured Programming Methodology (C++) Section Placed BELOW Playlist */}
      {selectedSubject === 'sub-spm' && (
        <div className="bg-[#0F1410]/80 backdrop-blur-md border border-[#10B981]/30 p-6 rounded-3xl space-y-3 shadow-xl animate-in fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] font-mono border border-[#10B981]/30">
                  316U06C107
                </span>
                <h3 className="text-base font-bold text-[#F0FDF4]">Structured Programming Methodology (C++)</h3>
              </div>
              <p className="text-xs text-[#86998A] leading-relaxed max-w-2xl">
                For each module section (Algorithms, Branching & Loops, Arrays & Strings, Functions & Pointers), please refer to the <strong>Notes</strong> section or stream the <strong>Entire Course Playlist</strong> in the video player.
              </p>
              <div className="pt-2">
                <Link
                  href="/resources?subject=sub-spm"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#151D17] hover:bg-[#131A14] text-[#F0FDF4] border border-[#1C271E] font-semibold text-xs transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Refer to Notes Section</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* 🎬 In-App Video Player Modal with Full Playlist Section */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F1410] w-full max-w-6xl rounded-3xl border border-[#1C271E] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95">
            {/* Player Header */}
            <div className="p-4 border-b border-[#1C271E] flex items-center justify-between bg-[#080A08]">
              <div className="flex items-center space-x-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-[#10B981] text-black flex items-center justify-center flex-shrink-0 font-bold">
                  <Tv className="w-4 h-4 text-black" />
                </div>
                <div className="truncate">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-[#F0FDF4] text-sm truncate">
                      {currentPlayingItem?.title || activeVideo.title}
                    </h3>
                    {currentPlayingItem?.isPlaylist && (
                      <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 text-[10px] font-bold">
                        Playlist Series
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#86998A] truncate">
                    {currentPlayingItem?.channelName || activeVideo.channelName} • Lecture {selectedPlaylistItemIndex + 1} of {activePlaylistVideos.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <a
                  href={
                    currentPlayingItem?.youtubeUrl ||
                    (currentPlayingItem?.playlistId
                      ? `https://www.youtube.com/playlist?list=${currentPlayingItem.playlistId}`
                      : `https://www.youtube.com/watch?v=${currentPlayingItem?.videoId || activeVideo.videoId}`)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#151D17] hover:bg-[#1C271E] text-[#86998A] hover:text-[#F0FDF4] text-xs flex items-center space-x-1 transition"
                  title="Open in YouTube"
                >
                  <ExternalLink className="w-4 h-4 text-[#34D399]" />
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-xl bg-[#151D17] hover:bg-[#1C271E] text-[#86998A] hover:text-[#F0FDF4] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Player Body & Playlist Split */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column (7 cols on lg): Video Player + Quick Controls */}
              <div className="lg:col-span-7 bg-black flex flex-col justify-between">
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <iframe
                    key={currentPlayingItem ? `${currentPlayingItem.id}-${currentPlayingItem.videoId}-${currentPlayingItem.playlistId || ''}` : activeVideo.id}
                    src={getEmbedUrl(currentPlayingItem)}
                    title={currentPlayingItem?.title || activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full border-none"
                  ></iframe>
                </div>

                {/* Video Navigation Bar under iframe */}
                <div className="p-3 bg-[#080A08] border-t border-[#1C271E] flex items-center justify-between text-xs text-[#86998A] gap-2 flex-wrap">
                  <button
                    onClick={handlePrevPlaylistItem}
                    disabled={selectedPlaylistItemIndex === 0}
                    className="px-3 py-1.5 rounded-xl bg-[#151D17] hover:bg-[#1C271E] disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1 text-[#F0FDF4] font-semibold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] text-[#86998A]">
                      Lesson {selectedPlaylistItemIndex + 1} / {activePlaylistVideos.length}
                    </span>
                    <a
                      href={
                        currentPlayingItem?.youtubeUrl ||
                        (currentPlayingItem?.playlistId
                          ? `https://www.youtube.com/playlist?list=${currentPlayingItem.playlistId}`
                          : `https://www.youtube.com/watch?v=${currentPlayingItem?.videoId || activeVideo.videoId}`)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 text-[11px] font-semibold flex items-center space-x-1 transition"
                      title="Open in YouTube"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Watch on YouTube</span>
                    </a>
                  </div>

                  <button
                    onClick={handleNextPlaylistItem}
                    disabled={selectedPlaylistItemIndex === activePlaylistVideos.length - 1}
                    className="px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1 text-black font-bold shadow-md"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column (5 cols on lg): Dedicated Playlist Directory */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-[#0F1410] border-t lg:border-t-0 lg:border-l border-[#1C271E] max-h-[550px]">
                {/* Playlist Header */}
                <div className="p-3 border-b border-[#1C271E] bg-[#080A08] flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#F0FDF4]">
                    <div className="p-1.5 rounded-lg bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
                      <ListVideo className="w-4 h-4" />
                    </div>
                    <span>Module Playlist Directory</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#151D17] border border-[#1C271E] text-[#34D399] font-bold">
                    {activePlaylistVideos.length} {activePlaylistVideos.length === 1 ? 'Lecture' : 'Lectures'}
                  </span>
                </div>

                {/* SPM Note in Player Modal */}
                {activeVideo?.subjectId === 'sub-spm' && (
                  <div className="m-3 p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] text-[#34D399] flex items-start space-x-2">
                    <Info className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0 mt-0.5" />
                    <span>
                      For module-wise handwritten notes, refer to the{' '}
                      <Link href="/resources?subject=sub-spm" target="_blank" className="text-[#34D399] underline font-bold">
                        Notes section
                      </Link>{' '}
                      or watch the entire playlist below.
                    </span>
                  </div>
                )}

                {/* Complete Playlist Videos List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-[#1C271E]">
                  <div className="flex items-center justify-between pb-1 text-[11px] text-[#86998A] font-semibold px-1">
                    <span>Click any lesson to switch:</span>
                    <span className="text-[#627766] font-mono text-[10px]">
                      Module order 1 → 5
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {activePlaylistVideos.map((item, idx) => {
                      const isPlaying = idx === selectedPlaylistItemIndex;
                      const itemUrl =
                        item.youtubeUrl ||
                        (item.playlistId
                          ? `https://www.youtube.com/playlist?list=${item.playlistId}`
                          : `https://www.youtube.com/watch?v=${item.videoId}`);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectPlaylistItem(idx)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isPlaying
                              ? 'bg-[#10B981]/15 border-[#10B981] shadow-lg shadow-emerald-950/30'
                              : 'bg-[#080A08] border-[#1C271E] hover:bg-[#151D17] hover:border-[#34D399]'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            {/* Index / Play Badge */}
                            <div
                              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isPlaying
                                  ? 'bg-[#10B981] text-black font-black animate-pulse'
                                  : 'bg-[#151D17] text-[#86998A]'
                              }`}
                            >
                              {isPlaying ? (
                                <Play className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <span>{item.lessonNumber}</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5 mb-0.5">
                                {item.moduleTitle && (
                                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#151D17] text-[#34D399] rounded">
                                    {item.moduleTitle.split(':')[0]}
                                  </span>
                                )}
                                <span className="text-[10px] text-[#86998A] truncate">
                                  {item.channelName}
                                </span>
                              </div>
                              <h4
                                className={`text-xs font-semibold leading-snug line-clamp-2 ${
                                  isPlaying ? 'text-[#34D399] font-bold' : 'text-[#F0FDF4]'
                                }`}
                              >
                                {item.title}
                              </h4>
                              {isPlaying && (
                                <span className="text-[10px] text-[#34D399] font-bold uppercase tracking-wider block mt-0.5">
                                  ▶ Now Playing
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#151D17] text-[#86998A] font-mono">
                              {item.duration}
                            </span>
                            <a
                              href={itemUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-md text-[#86998A] hover:text-[#F0FDF4] hover:bg-[#151D17] transition"
                              title="Open this in YouTube"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#34D399]" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Playlist Sidebar Footer */}
                <div className="p-3 border-t border-[#1C271E] bg-[#080A08] text-[11px] text-[#86998A] flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    <span>Ad-Free Clean Stream</span>
                  </span>
                  <span className="text-[#627766] font-mono text-[10px]">Somaiya Academic Player</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ➕ Add Video / Playlist Modal */}
      {isAddingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <div className="flex items-center space-x-2">
                <Tv className="w-5 h-5 text-[#34D399]" />
                <h3 className="font-bold text-[#F0FDF4] text-base">Add YouTube Video Resource</h3>
              </div>
              <button onClick={() => setIsAddingVideo(false)} className="text-[#86998A] hover:text-[#F0FDF4]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Type Selector Buttons */}
            <div>
              <label className="text-[11px] font-bold text-[#86998A] uppercase tracking-wider block mb-1.5">
                Choose Upload Target Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUploadKind('subject_master')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center space-y-1 ${
                    uploadKind === 'subject_master'
                      ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399] shadow-md'
                      : 'bg-[#080A08] border-[#1C271E] text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  <ListVideo className="w-4 h-4 text-[#34D399]" />
                  <span className="text-[11px]">Subject Playlist</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadKind('module_playlist')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center space-y-1 ${
                    uploadKind === 'module_playlist'
                      ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399] shadow-md'
                      : 'bg-[#080A08] border-[#1C271E] text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#34D399]" />
                  <span className="text-[11px]">Module Playlist</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadKind('module_video')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center space-y-1 ${
                    uploadKind === 'module_video'
                      ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399] shadow-md'
                      : 'bg-[#080A08] border-[#1C271E] text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#34D399]" />
                  <span className="text-[11px]">Single Video</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
              {/* Subject Selector */}
              <div>
                <label className="text-[#86998A] block mb-1">Select Course Subject *</label>
                <select
                  value={inputSubjectId}
                  onChange={(e) => {
                    setInputSubjectId(e.target.value);
                    setInputModuleId('');
                  }}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                >
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Module Selector (Only for module video / playlist) */}
              {uploadKind !== 'subject_master' && (
                <div>
                  <label className="text-[#86998A] block mb-1">
                    Select Syllabus Module *
                  </label>
                  <select
                    value={inputModuleId}
                    onChange={(e) => setInputModuleId(e.target.value)}
                    required
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                  >
                    <option value="">-- Choose Module --</option>
                    {availableModulesForInput.map((m) => (
                      <option key={m.id} value={m.id}>
                        Mod {m.moduleNumber}: {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* YouTube URL */}
              <div>
                <label className="text-[#86998A] block mb-1">
                  YouTube Video / Playlist URL *
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/playlist?list=..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              {/* Video/Playlist Title */}
              <div>
                <label className="text-[#86998A] block mb-1">Lecture / Playlist Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Module 1: Complete Matrices & Normal Form"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              {/* Channel Name & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Channel / Educator</label>
                  <input
                    type="text"
                    placeholder="e.g. Gate Smashers, Tikles Academy"
                    value={inputChannel}
                    onChange={(e) => setInputChannel(e.target.value)}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
                  />
                </div>
                <div>
                  <label className="text-[#86998A] block mb-1">Duration / Videos Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 14 Videos or 35:20"
                    value={inputDuration}
                    onChange={(e) => setInputDuration(e.target.value)}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-[#86998A] block mb-1">Topic Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={inputTags}
                  onChange={(e) => setInputTags(e.target.value)}
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#1C271E] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingVideo(false)}
                  className="px-4 py-2 rounded-xl bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg shadow-emerald-950/40"
                >
                  Publish Video Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-[#34D399]" />
                <h3 className="font-bold text-[#F0FDF4] text-base">Edit Video Details</h3>
              </div>
              <button onClick={() => setEditingVideo(null)} className="text-[#86998A] hover:text-[#F0FDF4]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditVideo} className="space-y-3 text-xs">
              <div>
                <label className="text-[#86998A] block mb-1">Title *</label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, title: e.target.value })
                  }
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">YouTube URL *</label>
                <input
                  type="url"
                  value={editingVideo.youtubeUrl}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })
                  }
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Channel Name</label>
                  <input
                    type="text"
                    value={editingVideo.channelName}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, channelName: e.target.value })
                    }
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                  />
                </div>
                <div>
                  <label className="text-[#86998A] block mb-1">Duration / Videos Count</label>
                  <input
                    type="text"
                    value={editingVideo.duration || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, duration: e.target.value })
                    }
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C271E] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteVideo(editingVideo.id)}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingVideo(null)}
                    className="px-4 py-2 rounded-xl bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
