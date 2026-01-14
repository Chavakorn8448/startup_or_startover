const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const USERS_PATH = path.join(DATA_DIR, "users.json");
const FOLDERS_PATH = path.join(DATA_DIR, "folders.json");
const VIDEOS_PATH = path.join(DATA_DIR, "videos.json");

const UPLOADS_DIR = path.join(__dirname, "uploads");
const PUBLIC_DIR = path.join(__dirname, "public");

// Ensure folders/files exist
for (const p of [DATA_DIR, UPLOADS_DIR, PUBLIC_DIR]) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
for (const p of [USERS_PATH, FOLDERS_PATH, VIDEOS_PATH]) {
  if (!fs.existsSync(p)) fs.writeFileSync(p, "[]", "utf-8");
}

// In-memory sessions: token -> { userId, role, username }
const sessions = new Map();

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(express.static(PUBLIC_DIR));
app.use("/uploads", express.static(UPLOADS_DIR));

// ---------- helpers ----------
function readJsonArray(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJsonArray(filePath, arr) {
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), "utf-8");
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix = "") {
  return prefix + crypto.randomBytes(10).toString("hex");
}

function createToken() {
  const base = crypto.randomBytes(24).toString("hex");
  const secret = process.env.SESSION_SECRET || "devsecret";
  const sig = crypto.createHmac("sha256", secret).update(base).digest("hex").slice(0, 16);
  return `${base}.${sig}`;
}

function sanitizeFilename(name) {
  return String(name || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isAudioOrVideo(file) {
  const ext = String(file.originalname || "").toLowerCase();
  const okExt = ext.endsWith(".mp3") || ext.endsWith(".mp4") || ext.endsWith(".webm");
  const mime = String(file.mimetype || "");
  const okMime = mime.startsWith("audio/") || mime.startsWith("video/");
  return okExt || okMime;
}

function getMe(req) {
  const token = req.cookies.session;
  if (!token) return null;
  return sessions.get(token) || null;
}

function requireAuth(req, res, next) {
  const me = getMe(req);
  if (!me) return res.status(401).json({ error: "Unauthorized" });
  req.user = me;
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}

// ---------- Multer ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const safe = sanitizeFilename(file.originalname);
    const unique = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}_${safe}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (isAudioOrVideo(file)) cb(null, true);
    else cb(new Error("Only MP3/MP4/WEBM files are allowed"));
  },
  limits: { fileSize: 250 * 1024 * 1024 }, // 250MB
});

// ---------- Auth ----------
app.post("/api/signup", async (req, res) => {
  const { username, email, password, adminCode } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing username/email/password" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const users = readJsonArray(USERS_PATH);
  const uname = String(username).trim();
  const mail = String(email).trim().toLowerCase();

  if (users.some((u) => u.username.toLowerCase() === uname.toLowerCase())) {
    return res.status(409).json({ error: "Username already exists" });
  }
  if (users.some((u) => u.email.toLowerCase() === mail)) {
    return res.status(409).json({ error: "Email already exists" });
  }

  // role rules:
  // - if FIRST_USER_IS_ADMIN=true and users empty => first user becomes admin
  // - else, admin only if adminCode matches ADMIN_INVITE_CODE (when set)
  let role = "user";
  const firstAdmin = String(process.env.FIRST_USER_IS_ADMIN || "").toLowerCase() === "true";
  if (firstAdmin && users.length === 0) role = "admin";

  const invite = String(process.env.ADMIN_INVITE_CODE || "").trim();
  if (invite && adminCode && String(adminCode).trim() === invite) role = "admin";

  const passwordHash = await bcrypt.hash(String(password), 10);

  users.push({
    id: createId("usr_"),
    username: uname,
    email: mail,
    passwordHash,
    role,
    createdAt: nowIso(),
  });

  writeJsonArray(USERS_PATH, users);
  res.json({ ok: true });
});

app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ error: "Missing identifier/password" });

  const users = readJsonArray(USERS_PATH);
  const idf = String(identifier).trim().toLowerCase();

  const user = users.find(
    (u) => u.username.toLowerCase() === idf || u.email.toLowerCase() === idf
  );
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = createToken();
  sessions.set(token, { userId: user.id, role: user.role, username: user.username });

  res.cookie("session", token, { httpOnly: true, sameSite: "lax" });
  res.json({ role: user.role, username: user.username });
});

app.post("/api/logout", (req, res) => {
  const token = req.cookies.session;
  if (token) sessions.delete(token);
  res.clearCookie("session");
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ role: req.user.role, username: req.user.username });
});

// ---------- Folders ----------
app.get("/api/folders", requireAuth, (req, res) => {
  res.json(readJsonArray(FOLDERS_PATH));
});

app.post("/api/folders", requireAuth, requireAdmin, (req, res) => {
  const { exam, name } = req.body || {};
  const ex = String(exam || "").trim().toUpperCase();
  const nm = String(name || "").trim();

  if (!["IELTS", "SAT"].includes(ex)) return res.status(400).json({ error: "Exam must be IELTS or SAT" });
  if (!nm) return res.status(400).json({ error: "Folder name required" });

  const folders = readJsonArray(FOLDERS_PATH);
  if (folders.some((f) => f.exam === ex && f.name.toLowerCase() === nm.toLowerCase())) {
    return res.status(409).json({ error: "Folder already exists" });
  }

  const folder = { id: createId("fld_"), exam: ex, name: nm, createdAt: nowIso() };
  folders.push(folder);
  writeJsonArray(FOLDERS_PATH, folders);
  res.json(folder);
});

app.put("/api/folders/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const nm = String(req.body?.name || "").trim();
  if (!nm) return res.status(400).json({ error: "Folder name required" });

  const folders = readJsonArray(FOLDERS_PATH);
  const idx = folders.findIndex((f) => f.id === id);
  if (idx === -1) return res.status(404).json({ error: "Folder not found" });

  const ex = folders[idx].exam;
  if (folders.some((f) => f.id !== id && f.exam === ex && f.name.toLowerCase() === nm.toLowerCase())) {
    return res.status(409).json({ error: "Folder name already used" });
  }

  folders[idx].name = nm;
  folders[idx].updatedAt = nowIso();
  writeJsonArray(FOLDERS_PATH, folders);
  res.json(folders[idx]);
});

app.delete("/api/folders/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;

  const folders = readJsonArray(FOLDERS_PATH);
  const idx = folders.findIndex((f) => f.id === id);
  if (idx === -1) return res.status(404).json({ error: "Folder not found" });

  // delete videos inside this folder too
  const videos = readJsonArray(VIDEOS_PATH);
  const toDelete = videos.filter((v) => v.folderId === id);

  for (const v of toDelete) {
    if (v.filename) {
      const p = path.join(UPLOADS_DIR, v.filename);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }

  writeJsonArray(VIDEOS_PATH, videos.filter((v) => v.folderId !== id));

  folders.splice(idx, 1);
  writeJsonArray(FOLDERS_PATH, folders);

  res.json({ ok: true, deletedVideos: toDelete.length });
});

// ---------- Videos ----------
app.get("/api/videos", requireAuth, (req, res) => {
  const ex = req.query?.exam ? String(req.query.exam).trim().toUpperCase() : null;
  const fid = req.query?.folderId ? String(req.query.folderId).trim() : null;

  const folders = readJsonArray(FOLDERS_PATH);
  const folderMap = new Map(folders.map((f) => [f.id, f]));

  let videos = readJsonArray(VIDEOS_PATH);

  if (fid) videos = videos.filter((v) => v.folderId === fid);

  if (ex && ["IELTS", "SAT"].includes(ex)) {
    const allowed = new Set(folders.filter((f) => f.exam === ex).map((f) => f.id));
    videos = videos.filter((v) => allowed.has(v.folderId));
  }

  res.json(
    videos.map((v) => ({
      ...v,
      folder: folderMap.get(v.folderId) || null,
    }))
  );
});

app.post("/api/videos", requireAuth, requireAdmin, upload.single("file"), (req, res) => {
  const title = String(req.body?.title || "").trim();
  const description = String(req.body?.description || "").trim();
  const folderId = String(req.body?.folderId || "").trim();

  if (!title) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Title is required" });
  }
  if (!folderId) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Folder is required" });
  }
  if (!req.file) return res.status(400).json({ error: "File is required" });

  const folders = readJsonArray(FOLDERS_PATH);
  if (!folders.some((f) => f.id === folderId)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Invalid folder" });
  }

  const videos = readJsonArray(VIDEOS_PATH);

  const filename = req.file.filename;
  const url = `/uploads/${filename}`;
  // const ext = path.extname(filename).toLowerCase();

  // const item = {
  //   id: createId("vid_"),
  //   title,
  //   description,
  //   folderId,
  //   filename,
  //   url,
  //   kind: ext === ".mp3" ? "audio" : "video",
  //   createdAt: nowIso(),
  //   updatedAt: nowIso(),
  // };

  const mime = String(req.file.mimetype || "");
  const kind = mime.startsWith("video/") ? "video" : "audio";

  const item = {
    id: createId("vid_"),
    title,
    description,
    folderId,
    filename,
    url,
    kind,
    mime,                 // store mime for debugging/UI (optional but useful)
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  videos.unshift(item);
  writeJsonArray(VIDEOS_PATH, videos);

  res.json(item);
});

app.put("/api/videos/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, folderId } = req.body || {};

  const videos = readJsonArray(VIDEOS_PATH);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) return res.status(404).json({ error: "Video not found" });

  if (title !== undefined) {
    const t = String(title).trim();
    if (!t) return res.status(400).json({ error: "Title cannot be empty" });
    videos[idx].title = t;
  }
  if (description !== undefined) {
    videos[idx].description = String(description).trim();
  }
  if (folderId !== undefined) {
    const fid = String(folderId).trim();
    const folders = readJsonArray(FOLDERS_PATH);
    if (!folders.some((f) => f.id === fid)) return res.status(400).json({ error: "Invalid folder" });
    videos[idx].folderId = fid;
  }

  videos[idx].updatedAt = nowIso();
  writeJsonArray(VIDEOS_PATH, videos);
  res.json(videos[idx]);
});

app.delete("/api/videos/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;

  const videos = readJsonArray(VIDEOS_PATH);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) return res.status(404).json({ error: "Video not found" });

  const [removed] = videos.splice(idx, 1);
  writeJsonArray(VIDEOS_PATH, videos);

  if (removed?.filename) {
    const p = path.join(UPLOADS_DIR, removed.filename);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  res.json({ ok: true });
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Prototype running at http://localhost:${PORT}`);
});
