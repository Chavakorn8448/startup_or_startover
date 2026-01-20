import { ArrowLeft, ChevronRight, Folder, Play, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useIsAdmin } from "@/app/hooks/useIsAdmin";

type LectureVideo = {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  tutor: string;
  tag: string;
};

type FolderView = {
  key: string;
  label: string;
  subtitle: string;
  badge: string;
  videos: LectureVideo[];
};

// Temporary mock data (replace with Supabase later)
const LIBRARY: FolderView[] = [
  {
    key: "sat",
    label: "SAT",
    subtitle: "Math + Verbal lesson clips",
    badge: "Target: 1550+",
    videos: [
      {
        id: 1,
        tag: "Math",
        title: "Algebra: Problem Solving Patterns",
        duration: "12:30",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
        tutor: "Alex Chen",
      },
      {
        id: 2,
        tag: "Math",
        title: "Geometry: Fast Rules & Shortcuts",
        duration: "15:45",
        thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
        tutor: "Alex Chen",
      },
      {
        id: 3,
        tag: "Verbal",
        title: "Reading: How to Find the Right Evidence",
        duration: "18:20",
        thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
        tutor: "Sarah Lin",
      },
    ],
  },
  {
    key: "ielts",
    label: "IELTS",
    subtitle: "Reading + Writing + Speaking + Listening",
    badge: "Band 9.0",
    videos: [
      {
        id: 11,
        tag: "Reading",
        title: "Skimming & Scanning (Band 8–9)",
        duration: "16:30",
        thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        tutor: "Emma Wilson",
      },
      {
        id: 12,
        tag: "Writing",
        title: "Task 2 Essay Structure That Scores",
        duration: "20:45",
        thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
        tutor: "David Park",
      },
      {
        id: 13,
        tag: "Speaking",
        title: "Part 2 Cue Card: What Examiners Want",
        duration: "17:25",
        thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
        tutor: "Michael Brown",
      },
    ],
  },
];

export function LectureLibrary() {
  const [activeFolderKey, setActiveFolderKey] = useState<string | null>(null);

  const [folders, setFolders] = useState<FolderView[]>(LIBRARY);

  // Admin UI state
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [modal, setModal] = useState<
    | { type: "addFolder" }
    | { type: "renameFolder" }
    | { type: "deleteFolder" }
    | { type: "addVideo" }
    | { type: "deleteVideo" }
    | null
  >(null);

  // Form fields
  const [folderKeyInput, setFolderKeyInput] = useState("");
  const [folderLabelInput, setFolderLabelInput] = useState("");
  const [folderSubtitleInput, setFolderSubtitleInput] = useState("");
  const [folderBadgeInput, setFolderBadgeInput] = useState("");

  const [targetFolderKey, setTargetFolderKey] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoTutor, setVideoTutor] = useState("");
  const [videoTag, setVideoTag] = useState("");
  const [videoDuration, setVideoDuration] = useState("10:00");
  const [videoThumbnail, setVideoThumbnail] = useState(
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
  );
  const [targetVideoId, setTargetVideoId] = useState<string>("");

  // Auto-select folder in modals
  useEffect(() => {
    if (activeFolderKey) setTargetFolderKey(activeFolderKey);
  }, [activeFolderKey]);


  // Logged-in user (read from access_token like your current app does)
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setUser(null);
        return;
      }

      const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

      try {
        const { data } = await supabase.auth.getUser(accessToken);
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  const { isAdmin } = useIsAdmin(user);

  const activeFolder = useMemo(() => {
    if (!activeFolderKey) return null;
    return folders.find((f) => f.key === activeFolderKey) ?? null;
  }, [activeFolderKey, folders]);


  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <nav className="border-b border-[#dae3ed]">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#1e3a5f] hover:text-[#3b729e] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="relative">
                <button
                  className="px-4 py-2 bg-white text-[#1e3a5f] border border-[#dae3ed] text-sm font-medium rounded-lg hover:shadow-md hover:scale-105 transition-all duration-300"
                  onClick={() => setAdminMenuOpen((v) => !v)}
                >
                  <span className="inline-flex items-center gap-2">
                    Manage Library
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {adminMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#dae3ed] rounded-xl shadow-xl overflow-hidden z-50">
                    <button
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#dae3ed]/30"
                      onClick={() => {
                        setAdminMenuOpen(false);
                        setModal({ type: "addFolder" });
                      }}
                    >
                      Add folder
                    </button>

                    <button
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#dae3ed]/30"
                      onClick={() => {
                        setAdminMenuOpen(false);
                        setModal({ type: "renameFolder" });
                      }}
                    >
                      Rename folder
                    </button>

                    <button
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#dae3ed]/30"
                      onClick={() => {
                        setAdminMenuOpen(false);
                        setModal({ type: "deleteFolder" });
                      }}
                    >
                      Delete folder
                    </button>

                    <div className="h-px bg-[#dae3ed]" />

                    <button
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#dae3ed]/30"
                      onClick={() => {
                        setAdminMenuOpen(false);
                        setModal({ type: "addVideo" });
                      }}
                    >
                      Add video lecture
                    </button>

                    <button
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#dae3ed]/30"
                      onClick={() => {
                        setAdminMenuOpen(false);
                        setModal({ type: "deleteVideo" });
                      }}
                    >
                      Delete video lecture
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="hidden sm:flex items-center gap-2 text-sm text-[#5a6f84]">
              <span>Library</span>
              {activeFolder ? (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-[#1e3a5f] font-medium">{activeFolder.label}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-4">
            Lecture Library
          </h1>
          <p className="text-lg text-[#5a6f84] max-w-2xl mx-auto">
            Your lesson clips are organized into folders. Choose a folder to see all videos inside.
          </p>
        </div>

        {/* Folder view */}
        {!activeFolder ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {folders.map((folder) => (
              <button
                key={folder.key}
                onClick={() => setActiveFolderKey(folder.key)}
                className="text-left group bg-white border border-[#dae3ed] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#dae3ed] to-[#9ab8ce]/40 flex items-center justify-center border border-[#9ab8ce]/30">
                      <Folder className="w-6 h-6 text-[#1e3a5f]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-[#0a1628]">{folder.label}</h2>
                        <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-xs font-medium rounded-full">
                          {folder.badge}
                        </span>
                      </div>

                      <p className="text-sm text-[#5a6f84] mt-1">{folder.subtitle}</p>
                      <p className="text-sm text-[#5a6f84] mt-3">{folder.videos.length} videos</p>
                    </div>
                  </div>

                  <div className="text-[#5a6f84] group-hover:text-[#1e3a5f] transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Folder header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#dae3ed] to-[#9ab8ce]/40 flex items-center justify-center border border-[#9ab8ce]/30">
                    <Folder className="w-6 h-6 text-[#1e3a5f]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#0a1628]">{activeFolder.label}</h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm font-medium rounded-full">
                    {activeFolder.badge}
                  </span>
                </div>
                <p className="text-[#5a6f84] mt-2">{activeFolder.subtitle}</p>
              </div>

              <button
                onClick={() => setActiveFolderKey(null)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#1e3a5f] border-2 border-[#9ab8ce] text-sm font-medium rounded-lg hover:border-[#3b729e] hover:bg-[#dae3ed]/30 hover:scale-105 transition-all duration-300"
              >
                Back to folders
              </button>
            </div>

            {/* Videos grid (thumbnails only; no embedded video) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFolder.videos.map((video) => (
                <div
                  key={video.id}
                  className="group bg-white border border-[#dae3ed] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#1e3a5f] ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {video.duration}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="inline-block px-3 py-1 bg-[#dae3ed]/60 border border-[#dae3ed] text-[#1e3a5f] text-xs font-semibold rounded-full mb-3">
                      {video.tag}
                    </div>
                    <h3 className="font-semibold text-[#0a1628] mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[#5a6f84]">{video.tutor}</p>
                    <p className="text-xs text-[#5a6f84] mt-2">
                      (Video will open here later — placeholder for now)
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-14 text-center bg-gradient-to-br from-[#dae3ed] to-[#9ab8ce]/30 rounded-2xl p-10 border border-[#9ab8ce]/20">
              <h3 className="text-2xl font-bold text-[#0a1628] mb-3">
                Want a guided plan for this folder?
              </h3>
              <p className="text-[#5a6f84] mb-6 max-w-2xl mx-auto">
                Book a free trial session and we’ll build a personalized roadmap for your target score.
              </p>
              <Link
                to="/video-demos"
                className="inline-block px-9 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white font-medium rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Book a Free Trial
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* Admin Modal */}
      {isAdmin && modal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#dae3ed] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#dae3ed]">
              <div className="font-semibold text-[#0a1628]">
                {modal.type === "addFolder" && "Add folder"}
                {modal.type === "renameFolder" && "Rename folder"}
                {modal.type === "deleteFolder" && "Delete folder"}
                {modal.type === "addVideo" && "Add video lecture"}
                {modal.type === "deleteVideo" && "Delete video lecture"}
              </div>
              <button
                className="p-2 rounded-lg hover:bg-[#dae3ed]/40 transition"
                onClick={() => setModal(null)}
              >
                <X className="w-5 h-5 text-[#1e3a5f]" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Folder selector used by several modals */}
              {(modal.type !== "addFolder") && (
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                    Target folder
                  </label>
                  <select
                    value={targetFolderKey}
                    onChange={(e) => setTargetFolderKey(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                  >
                    <option value="" disabled>
                      Select a folder
                    </option>
                    {folders.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label} ({f.key})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ADD FOLDER */}
              {modal.type === "addFolder" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                        Folder key (unique)
                      </label>
                      <input
                        value={folderKeyInput}
                        onChange={(e) => setFolderKeyInput(e.target.value)}
                        placeholder="e.g., sat-math"
                        className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                        Folder name
                      </label>
                      <input
                        value={folderLabelInput}
                        onChange={(e) => setFolderLabelInput(e.target.value)}
                        placeholder="e.g., SAT Math"
                        className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                      Subtitle
                    </label>
                    <input
                      value={folderSubtitleInput}
                      onChange={(e) => setFolderSubtitleInput(e.target.value)}
                      placeholder="e.g., Algebra + Geometry"
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                      Badge
                    </label>
                    <input
                      value={folderBadgeInput}
                      onChange={(e) => setFolderBadgeInput(e.target.value)}
                      placeholder="e.g., Target: 1550+"
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    />
                  </div>
                </>
              ) : null}

              {/* RENAME FOLDER */}
              {modal.type === "renameFolder" ? (
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                    New folder name
                  </label>
                  <input
                    value={folderLabelInput}
                    onChange={(e) => setFolderLabelInput(e.target.value)}
                    placeholder="e.g., IELTS Speaking"
                    className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                  />
                </div>
              ) : null}

              {/* ADD VIDEO */}
              {modal.type === "addVideo" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                      Video title
                    </label>
                    <input
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="e.g., Task 2 Thesis Statements"
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                        Tag
                      </label>
                      <input
                        value={videoTag}
                        onChange={(e) => setVideoTag(e.target.value)}
                        placeholder="e.g., Writing"
                        className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                        Duration
                      </label>
                      <input
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        placeholder="e.g., 12:30"
                        className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                        Tutor
                      </label>
                      <input
                        value={videoTutor}
                        onChange={(e) => setVideoTutor(e.target.value)}
                        placeholder="e.g., Emma"
                        className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                      Thumbnail URL
                    </label>
                    <input
                      value={videoThumbnail}
                      onChange={(e) => setVideoThumbnail(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    />
                  </div>
                </>
              ) : null}

              {/* DELETE VIDEO */}
              {modal.type === "deleteVideo" ? (
                <>
                  <p className="text-sm text-[#5a6f84]">
                    Choose a folder first, then choose which video to delete.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                      Target video
                    </label>
                    <select
                      value={targetVideoId}
                      onChange={(e) => setTargetVideoId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    >
                      <option value="" disabled>
                        Select a video
                      </option>
                      {(folders.find((f) => f.key === targetFolderKey)?.videos ?? []).map((v) => (
                        <option key={v.id} value={String(v.id)}>
                          {v.title} (id: {v.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}

              {/* DELETE FOLDER */}
              {modal.type === "deleteFolder" ? (
                <p className="text-sm text-[#5a6f84]">
                  This will remove the folder and its videos (local-only for now).
                </p>
              ) : null}
            </div>

            <div className="px-6 py-4 border-t border-[#dae3ed] flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 bg-white border border-[#dae3ed] text-[#1e3a5f] rounded-lg hover:bg-[#dae3ed]/30 transition"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white rounded-lg hover:shadow-lg transition"
                onClick={() => {
                  // ----- ACTIONS -----
                  if (modal.type === "addFolder") {
                    const key = folderKeyInput.trim();
                    const label = folderLabelInput.trim();
                    if (!key || !label) return;

                    if (folders.some((f) => f.key === key)) return;

                    setFolders((prev) => [
                      ...prev,
                      {
                        key,
                        label,
                        subtitle: folderSubtitleInput.trim() || "New folder",
                        badge: folderBadgeInput.trim() || "New",
                        videos: [],
                      },
                    ]);

                    setFolderKeyInput("");
                    setFolderLabelInput("");
                    setFolderSubtitleInput("");
                    setFolderBadgeInput("");
                    setModal(null);
                    return;
                  }

                  if (modal.type === "renameFolder") {
                    if (!targetFolderKey) return;
                    const newLabel = folderLabelInput.trim();
                    if (!newLabel) return;

                    setFolders((prev) =>
                      prev.map((f) => (f.key === targetFolderKey ? { ...f, label: newLabel } : f))
                    );

                    setFolderLabelInput("");
                    setModal(null);
                    return;
                  }

                  if (modal.type === "deleteFolder") {
                    if (!targetFolderKey) return;

                    setFolders((prev) => prev.filter((f) => f.key !== targetFolderKey));
                    if (activeFolderKey === targetFolderKey) setActiveFolderKey(null);

                    setTargetFolderKey("");
                    setModal(null);
                    return;
                  }

                  if (modal.type === "addVideo") {
                    if (!targetFolderKey) return;
                    const title = videoTitle.trim();
                    if (!title) return;

                    const newId = Date.now(); // local-only unique id
                    const newVideo = {
                      id: newId,
                      title,
                      duration: videoDuration.trim() || "10:00",
                      thumbnail: videoThumbnail.trim(),
                      tutor: videoTutor.trim() || "Tutor",
                      tag: videoTag.trim() || "Lesson",
                    };

                    setFolders((prev) =>
                      prev.map((f) =>
                        f.key === targetFolderKey ? { ...f, videos: [newVideo, ...f.videos] } : f
                      )
                    );

                    setVideoTitle("");
                    setVideoTutor("");
                    setVideoTag("");
                    setVideoDuration("10:00");
                    setModal(null);
                    return;
                  }

                  if (modal.type === "deleteVideo") {
                    if (!targetFolderKey || !targetVideoId) return;

                    const vid = Number(targetVideoId);

                    setFolders((prev) =>
                      prev.map((f) =>
                        f.key === targetFolderKey
                          ? { ...f, videos: f.videos.filter((v) => v.id !== vid) }
                          : f
                      )
                    );

                    setTargetVideoId("");
                    setModal(null);
                    return;
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
