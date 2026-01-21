import {
  ArrowLeft,
  ChevronRight,
  Folder,
  Play,
  ChevronDown,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useIsAdmin } from "@/app/hooks/useIsAdmin";

/* =======================
   Types
======================= */

type LectureVideo = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  tutor: string;
  tag: string;
  video_path?: string;
};

type FolderRow = {
  id: string;
  key: string;
  label: string;
  subtitle: string | null;
  badge: string | null;
  parent_folder_id: string | null;
  created_at?: string;
};

type VideoRow = {
  id: string;
  folder_id: string;
  title: string | null;
  duration: string | null;
  thumbnail: string | null;
  tutor: string | null;
  tag: string | null;
  video_path: string | null;
  created_at?: string;
};

type FolderView = {
  id: string;
  key: string;
  label: string;
  subtitle: string;
  badge: string;
  parentId: string | null;
  videos: LectureVideo[];
};

/* =======================
   Supabase client
======================= */

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

/* =======================
   Component
======================= */

export function LectureLibrary() {
  /* ---------- Core state ---------- */
  const [folders, setFolders] = useState<FolderView[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  /* ---------- Admin dropdown + modal ---------- */
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [modal, setModal] = useState<
    | "addFolder"
    | "renameFolder"
    | "deleteFolder"
    | "addVideo"
    | "deleteVideo"
    | null
  >(null);

  /* ---------- Modal form state ---------- */
  const [targetFolderId, setTargetFolderId] = useState<string>(""); // rename/delete/addVideo/deleteVideo
  const [targetVideoId, setTargetVideoId] = useState<string>(""); // deleteVideo

  // Add folder: choose parent ("" = root)
  const [parentFolderId, setParentFolderId] = useState<string>("");

  // Folder fields
  const [folderKeyInput, setFolderKeyInput] = useState("");
  const [folderLabelInput, setFolderLabelInput] = useState("");
  const [folderSubtitleInput, setFolderSubtitleInput] = useState("");
  const [folderBadgeInput, setFolderBadgeInput] = useState("");

  // Video fields
  const [videoTitle, setVideoTitle] = useState("");
  const [videoTutor, setVideoTutor] = useState("");
  const [videoTag, setVideoTag] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  /* ---------- Auth ---------- */
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await supabase.auth.getUser(token);
      setUser(data.user ?? null);
    };
    checkUser();
  }, []);

  const { isAdmin } = useIsAdmin(user);

  /* =======================
     Derived helpers
======================= */

  const activeFolder = useMemo(() => {
    if (!activeFolderId) return null;
    return folders.find((f) => f.id === activeFolderId) ?? null;
  }, [activeFolderId, folders]);

  const rootFolders = useMemo(() => folders.filter((f) => !f.parentId), [folders]);

  const childFolders = useMemo(() => {
    if (!activeFolder) return [];
    return folders.filter((f) => f.parentId === activeFolder.id);
  }, [folders, activeFolder]);

  const breadcrumbChain = useMemo(() => {
    if (!activeFolder) return [];
    const byId = new Map(folders.map((f) => [f.id, f]));
    const chain: FolderView[] = [];
    let cur: FolderView | undefined = activeFolder;
    while (cur) {
      chain.unshift(cur);
      if (!cur.parentId) break;
      cur = byId.get(cur.parentId);
    }
    return chain;
  }, [activeFolder, folders]);

  const folderOptions = useMemo(() => {
    const byId = new Map(folders.map((f) => [f.id, f]));
    const getPath = (id: string) => {
      const parts: string[] = [];
      let cur: FolderView | undefined = byId.get(id);
      while (cur) {
        parts.unshift(cur.label);
        if (!cur.parentId) break;
        cur = byId.get(cur.parentId);
      }
      return parts.join(" / ");
    };
    return folders.map((f) => ({
      id: f.id,
      label: `${getPath(f.id)} (${f.key})`,
    }));
  }, [folders]);

  const selectedFolderForModal = useMemo(() => {
    if (!targetFolderId) return null;
    return folders.find((f) => f.id === targetFolderId) ?? null;
  }, [targetFolderId, folders]);

  const videosForSelectedFolder = useMemo(() => {
    return selectedFolderForModal?.videos ?? [];
  }, [selectedFolderForModal]);

  /* =======================
     Load library from Supabase
     Tables:
       lecture_folders
       lecture_videos
======================= */

  const loadLibrary = async () => {
    const [
      { data: folderRows, error: folderErr },
      { data: videoRows, error: videoErr },
    ] = await Promise.all([
      supabase
        .from("lecture_folders")
        .select("id,key,label,subtitle,badge,parent_folder_id,created_at")
        .order("created_at", { ascending: true }),
      supabase
        .from("lecture_videos")
        .select("id,folder_id,title,duration,thumbnail,tutor,tag,video_path,created_at")
        .order("created_at", { ascending: true }),
    ]);

    if (folderErr) {
      console.error(folderErr);
      alert(folderErr.message);
      return;
    }
    if (videoErr) {
      console.error(videoErr);
      alert(videoErr.message);
      return;
    }

    const foldersMapped: FolderView[] = (folderRows ?? []).map((f: FolderRow) => ({
      id: f.id,
      key: f.key,
      label: f.label,
      subtitle: f.subtitle ?? "",
      badge: f.badge ?? "",
      parentId: f.parent_folder_id ?? null,
      videos: [],
    }));

    const byFolder = new Map<string, LectureVideo[]>();
    for (const v of (videoRows ?? []) as VideoRow[]) {
      const arr = byFolder.get(v.folder_id) ?? [];
      arr.push({
        id: v.id,
        title: v.title ?? "",
        duration: v.duration ?? "",
        thumbnail: v.thumbnail ?? "",
        tutor: v.tutor ?? "",
        tag: v.tag ?? "",
        video_path: v.video_path ?? undefined,
      });
      byFolder.set(v.folder_id, arr);
    }

    const merged = foldersMapped.map((f) => ({
      ...f,
      videos: byFolder.get(f.id) ?? [],
    }));

    setFolders(merged);

    if (activeFolderId) {
      const stillExists = merged.some((f) => f.id === activeFolderId);
      if (!stillExists) setActiveFolderId(null);
    }
  };

  // Seed only if empty
  const ensureDefaults = async () => {
    const { data, error } = await supabase.from("lecture_folders").select("id").limit(1);
    if (error) return;

    if (!data || data.length === 0) {
      await supabase.from("lecture_folders").insert([
        {
          key: "sat",
          label: "SAT",
          subtitle: "Math + Verbal lesson clips",
          badge: "Target: 1550+",
          parent_folder_id: null,
        },
        {
          key: "ielts",
          label: "IELTS",
          subtitle: "Reading + Writing + Speaking + Listening",
          badge: "Band 9.0",
          parent_folder_id: null,
        },
      ]);
    }
  };

  useEffect(() => {
    (async () => {
      await ensureDefaults();
      await loadLibrary();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================
     Modal helpers
======================= */

  const resetModalFields = () => {
    // for rename/delete/addVideo/deleteVideo: default to current folder (if inside one)
    setTargetFolderId(activeFolder?.id ?? "");
    setTargetVideoId("");

    // for addFolder: default to current folder as parent (subfolder creation)
    setParentFolderId(activeFolder?.id ?? "");

    setFolderKeyInput("");
    setFolderLabelInput("");
    setFolderSubtitleInput("");
    setFolderBadgeInput("");

    setVideoTitle("");
    setVideoTutor("");
    setVideoTag("");
    setVideoDuration("");
    setVideoThumbnail("");

    setVideoFile(null);
  };

  const openModal = (type: NonNullable<typeof modal>) => {
    resetModalFields();
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    resetModalFields();
  };

  const requireAdmin = () => {
    if (!isAdmin) {
      alert("Admin access required.");
      return false;
    }
    return true;
  };

  const playVideo = async (video: LectureVideo) => {
    try {
      if (!video.video_path) {
        alert("This video has no stored file path.");
        return;
      }

      const { data, error } = await supabase.storage
        .from("lecture-videos") // ⚠️ bucket name
        .createSignedUrl(video.video_path, 60 * 10); // 10 minutes

      if (error) throw error;

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Failed to open video");
    }
  };

  /* =======================
     Admin actions (Supabase)
======================= */

  const addFolder = async () => {
    if (!requireAdmin()) return;

    const key = folderKeyInput.trim();
    const label = folderLabelInput.trim();
    const subtitle = folderSubtitleInput.trim();
    const badge = folderBadgeInput.trim();

    if (!key || !label) {
      alert("Folder key + name are required.");
      return;
    }

    const parent_id = parentFolderId ? parentFolderId : null;

    const { error } = await supabase.from("lecture_folders").insert({
      key,
      label,
      subtitle,
      badge,
      parent_folder_id: parent_id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    await loadLibrary();
    closeModal();
  };

  const renameFolder = async () => {
    if (!requireAdmin()) return;

    const folder = selectedFolderForModal;
    if (!folder) {
      alert("Please select a folder.");
      return;
    }

    const newLabel = folderLabelInput.trim();
    const newSubtitle = folderSubtitleInput.trim();
    const newBadge = folderBadgeInput.trim();

    if (!newLabel) {
      alert("New folder name is required.");
      return;
    }

    const { error } = await supabase
      .from("lecture_folders")
      .update({
        label: newLabel,
        subtitle: newSubtitle,
        badge: newBadge,
      })
      .eq("id", folder.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadLibrary();
    closeModal();
  };

  const deleteFolder = async () => {
    if (!requireAdmin()) return;

    const folder = selectedFolderForModal;
    if (!folder) {
      alert("Please select a folder.");
      return;
    }

    const ok = confirm(
      `Delete folder "${folder.label}" and ALL videos inside?\n\nNote: This deletes only this folder. If it has subfolders, they will remain but become orphaned unless you handle recursive delete.`
    );
    if (!ok) return;

    // Delete videos in this folder
    await supabase.from("lecture_videos").delete().eq("folder_id", folder.id);

    // Optional: move child folders up to root (so they don’t disappear from UI)
    await supabase
      .from("lecture_folders")
      .update({ parent_folder_id: folder.parentId ?? null })
      .eq("parent_folder_id", folder.id);

    // Delete folder
    const { error } = await supabase.from("lecture_folders").delete().eq("id", folder.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (activeFolderId === folder.id) {
      setActiveFolderId(folder.parentId ?? null);
    }

    await loadLibrary();
    closeModal();
  };

  const toNull = (s: string) => {
    const t = s.trim();
    return t.length ? t : null;
  };


  const addVideo = async () => {
    if (!requireAdmin()) return;

    const folder = selectedFolderForModal;
    if (!folder) {
      alert("Please select a folder to add the video into.");
      return;
    }

    const title = videoTitle.trim();
    if (!title) {
      alert("Video title is required.");
      return;
    }

    if (!videoFile) {
      alert("Please upload an MP4 file.");
      return;
    }

    // (Optional) allow any video type, but keep mp4-only if you want strict:
    // if (videoFile.type !== "video/mp4") { alert("Only MP4 allowed"); return; }

    // 1) Upload
    const ext = videoFile.name.split(".").pop() || "mp4";
    const safeExt = ext.toLowerCase() === "mp4" ? "mp4" : "mp4";
    const fileName = `${crypto.randomUUID()}.${safeExt}`;
    const storagePath = `folder-${folder.id}/${fileName}`;

    const uploadRes = await supabase.storage
      .from("lecture-videos")
      .upload(storagePath, videoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "video/mp4",
      });

    if (uploadRes.error) {
      alert(uploadRes.error.message);
      return;
    }

    // 2) Insert DB row — ONLY title is required, everything else optional
    const payload = {
      folder_id: folder.id,
      title, // required
      tutor: toNull(videoTutor),
      tag: toNull(videoTag),
      duration: toNull(videoDuration),
      thumbnail: toNull(videoThumbnail),
      video_path: storagePath, // required for playback later
    };

    const { error } = await supabase.from("lecture_videos").insert(payload);

    if (error) {
      // rollback storage if DB fails
      await supabase.storage.from("lecture-videos").remove([storagePath]);
      alert(error.message);
      return;
    }

    await loadLibrary();
    closeModal();
  };

  const deleteVideo = async () => {
    if (!requireAdmin()) return;

    const folder = selectedFolderForModal;
    if (!folder) {
      alert("Please select a folder.");
      return;
    }
    if (!targetVideoId) {
      alert("Please select a video to delete.");
      return;
    }

    const video = folder.videos.find((v) => v.id === targetVideoId);
    const ok = confirm(`Delete video "${video?.title ?? "this video"}"?`);
    if (!ok) return;

    const { error } = await supabase.from("lecture_videos").delete().eq("id", targetVideoId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadLibrary();
    closeModal();
  };

  /* =======================
     Render (UI kept the same)
======================= */

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
                    {[
                      ["addFolder", "Add folder"],
                      ["renameFolder", "Rename folder"],
                      ["deleteFolder", "Delete folder"],
                      ["divider", ""],
                      ["addVideo", "Add video lecture"],
                      ["deleteVideo", "Delete video lecture"],
                    ].map(([key, label]) =>
                      key === "divider" ? (
                        <div key="divider" className="h-px bg-[#dae3ed]" />
                      ) : (
                        <button
                          key={key}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-[#dae3ed]/30"
                          onClick={() => {
                            setAdminMenuOpen(false);
                            openModal(key as any);
                          }}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Breadcrumb (multi-level) */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#5a6f84]">
              <span>Library</span>
              {breadcrumbChain.map((f) => (
                <span key={f.id} className="inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  <button
                    className="text-[#1e3a5f] font-medium hover:text-[#3b729e]"
                    onClick={() => setActiveFolderId(f.id)}
                  >
                    {f.label}
                  </button>
                </span>
              ))}
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

        {/* Root view */}
        {!activeFolder ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {rootFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className="text-left group bg-white border border-[#dae3ed] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#dae3ed] to-[#9ab8ce]/40 flex items-center justify-center border border-[#9ab8ce]/30">
                      <Folder className="w-6 h-6 text-[#1e3a5f]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-[#0a1628]">
                          {folder.label}
                        </h2>
                        <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-xs font-medium rounded-full">
                          {folder.badge}
                        </span>
                      </div>

                      <p className="text-sm text-[#5a6f84] mt-1">{folder.subtitle}</p>
                      <p className="text-sm text-[#5a6f84] mt-3">
                        {folder.videos.length} videos
                      </p>
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
                  <h2 className="text-3xl font-bold text-[#0a1628]">
                    {activeFolder.label}
                  </h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-sm font-medium rounded-full">
                    {activeFolder.badge}
                  </span>
                </div>
                <p className="text-[#5a6f84] mt-2">{activeFolder.subtitle}</p>
              </div>

              <button
                onClick={() => setActiveFolderId(activeFolder.parentId ?? null)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#1e3a5f] border-2 border-[#9ab8ce] text-sm font-medium rounded-lg hover:border-[#3b729e] hover:bg-[#dae3ed]/30 hover:scale-105 transition-all duration-300"
              >
                Back
              </button>
            </div>

            {/* Subfolders */}
            {childFolders.length > 0 ? (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                  Subfolders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {childFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setActiveFolderId(folder.id)}
                      className="text-left group bg-white border border-[#dae3ed] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#dae3ed] to-[#9ab8ce]/40 flex items-center justify-center border border-[#9ab8ce]/30">
                            <Folder className="w-6 h-6 text-[#1e3a5f]" />
                          </div>

                          <div>
                            <div className="flex items-center gap-3">
                              <h2 className="text-2xl font-bold text-[#0a1628]">
                                {folder.label}
                              </h2>
                              <span className="px-3 py-1 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white text-xs font-medium rounded-full">
                                {folder.badge}
                              </span>
                            </div>

                            <p className="text-sm text-[#5a6f84] mt-1">
                              {folder.subtitle}
                            </p>

                            <p className="text-sm text-[#5a6f84] mt-3">
                              {folder.videos.length} videos
                            </p>
                          </div>
                        </div>

                        <div className="text-[#5a6f84] group-hover:text-[#1e3a5f] transition-colors">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Videos grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFolder.videos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => playVideo(video)}
                  className="group bg-white border border-[#dae3ed] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                >
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={video.thumbnail?.trim() || "https://placehold.co/640x360?text=Video"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#1e3a5f] ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {video.duration || "—"}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="inline-block px-3 py-1 bg-[#dae3ed]/60 border border-[#dae3ed] text-[#1e3a5f] text-xs font-semibold rounded-full mb-3">
                      {video.tag || "Lecture"}
                    </div>

                    <h3 className="font-semibold text-[#0a1628] mb-2 line-clamp-2">
                      {video.title}
                    </h3>

                    <p className="text-sm text-[#5a6f84]">{video.tutor || "—"}</p>

                    <p className="text-xs text-[#5a6f84] mt-2">
                      (Click to play — coming next)
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin modal */}
      {isAdmin && modal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#dae3ed] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#dae3ed]">
              <div className="font-semibold text-[#0a1628]">
                {modal === "addFolder" && "Add folder"}
                {modal === "renameFolder" && "Rename folder"}
                {modal === "deleteFolder" && "Delete folder"}
                {modal === "addVideo" && "Add video lecture"}
                {modal === "deleteVideo" && "Delete video lecture"}
              </div>
              <button
                className="p-2 rounded-lg hover:bg-[#dae3ed]/40 transition"
                onClick={closeModal}
              >
                <X className="w-5 h-5 text-[#1e3a5f]" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Add folder: choose parent */}
              {modal === "addFolder" ? (
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                    Create inside
                  </label>
                  <select
                    value={parentFolderId}
                    onChange={(e) => setParentFolderId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                  >
                    <option value="">(Root)</option>
                    {folderOptions.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* For other modals: choose target folder */}
              {modal !== "addFolder" ? (
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                    Target folder
                  </label>
                  <select
                    value={targetFolderId}
                    onChange={(e) => setTargetFolderId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                  >
                    <option value="" disabled>
                      Select a folder
                    </option>
                    {folderOptions.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Add folder fields */}
              {modal === "addFolder" ? (
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

              {/* Rename folder */}
              {modal === "renameFolder" ? (
                <>
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

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                      New subtitle (optional)
                    </label>
                    <input
                      value={folderSubtitleInput}
                      onChange={(e) => setFolderSubtitleInput(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                      New badge (optional)
                    </label>
                    <input
                      value={folderBadgeInput}
                      onChange={(e) => setFolderBadgeInput(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    />
                  </div>
                </>
              ) : null}

              {/* Delete folder */}
              {modal === "deleteFolder" ? (
                <p className="text-sm text-[#5a6f84]">
                  This will permanently delete the folder and videos inside.
                </p>
              ) : null}

              {/* Add video */}
              {modal === "addVideo" ? (
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
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                    />
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1">
                        Upload MP4
                      </label>
                      <input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                        className="w-full px-3 py-2 border border-[#dae3ed] rounded-lg"
                      />
                      <p className="text-xs text-[#5a6f84] mt-1">
                        Upload an mp4 file. We'll store it in Supabase Storage (private).
                      </p>
                    </div>

                  </div>
                </>
              ) : null}

              {/* Delete video */}
              {modal === "deleteVideo" ? (
                <>
                  <p className="text-sm text-[#5a6f84]">
                    Choose a folder first, then choose a video to delete.
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
                      {videosForSelectedFolder.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}
            </div>

            <div className="px-6 py-4 border-t border-[#dae3ed] flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 bg-white border border-[#dae3ed] text-[#1e3a5f] rounded-lg hover:bg-[#dae3ed]/30 transition"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#3b729e] text-white rounded-lg hover:shadow-lg transition"
                onClick={async () => {
                  if (modal === "addFolder") return addFolder();
                  if (modal === "renameFolder") return renameFolder();
                  if (modal === "deleteFolder") return deleteFolder();
                  if (modal === "addVideo") return addVideo();
                  if (modal === "deleteVideo") return deleteVideo();
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
