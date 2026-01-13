const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const RECORDINGS_PATH = path.join(DATA_DIR, "recordings.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const PUBLIC_DIR = path.join(__dirname, "public");

// Ensure folders exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(RECORDINGS_PATH)) fs.writeFileSync(RECORDINGS_PATH, "[]", "utf-8");

// In-memory sessions: token -> { role, username }
const sessions = new Map();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(PUBLIC_DIR));
app.use("/uploads", express.static(UPLOADS_DIR)); // serve mp3 files

function readRecordings() {
  try {
    const raw = fs.readFileSync(RECORDINGS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecordings(list) {
  fs.writeFileSync(RECORDINGS_PATH, JSON.stringify(list, null, 2), "utf-8");
}

function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

function requireAuth(req, res, next) {
  const token = req.cookies.session;
  if (!token || !sessions.has(token)) return res.status(401).json({ error: "Unauthorized" });
  req.user = sessions.get(token);
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}

// Multer for MP3 uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const unique = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}_${safe}`;
    cb(null, unique);
  },
});

function fileFilter(req, file, cb) {
  const okMime = file.mimetype === "audio/mpeg" || file.mimetype === "audio/mp3";
  const okExt = file.originalname.toLowerCase().endsWith(".mp3");
  if (okMime || okExt) cb(null, true);
  else cb(new Error("Only MP3 files are allowed"));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// --- Auth APIs ---

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing username/password" });

  const isAdmin =
    username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;

  const role = isAdmin ? "admin" : "user";

  const token = createToken();
  sessions.set(token, { role, username });

  // cookie for session
  res.cookie("session", token, {
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // enable when using HTTPS
  });

  res.json({ role });
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

// --- Recordings APIs ---

app.get("/api/recordings", requireAuth, (req, res) => {
  const list = readRecordings();
  res.json(list);
});

app.post(
  "/api/recordings",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  (req, res) => {
    const title = (req.body?.title || "").trim();
    const description = (req.body?.description || "").trim();

    if (!title) {
      // remove uploaded file if title missing
      if (req.file?.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Title is required" });
    }
    if (!req.file) return res.status(400).json({ error: "MP3 file is required" });

    const list = readRecordings();

    const item = {
      id: crypto.randomBytes(10).toString("hex"),
      title,
      description,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString(),
    };

    list.unshift(item);
    writeRecordings(list);

    res.json(item);
  }
);

app.delete("/api/recordings/:id", requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const list = readRecordings();
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const [removed] = list.splice(idx, 1);
  writeRecordings(list);

  // remove file
  if (removed?.filename) {
    const p = path.join(UPLOADS_DIR, removed.filename);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  res.json({ ok: true });
});

// Serve SPA fallback (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Prototype running at http://localhost:${PORT}`);
});
