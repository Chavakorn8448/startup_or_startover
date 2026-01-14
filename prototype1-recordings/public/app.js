const el = (id) => document.getElementById(id);

const views = {
  auth: el("viewAuth"),
  userHome: el("viewUserHome"),
  userExam: el("viewUserExam"),
  userFolder: el("viewUserFolder"),
  adminHome: el("viewAdminHome"),
  adminFolders: el("viewAdminFolders"),
  adminUploads: el("viewAdminUploads"),
};

const homeBrand = el("homeBrand");
const roleBadge = el("roleBadge");
const logoutBtn = el("logoutBtn");

// Auth UI
const tabLogin = el("tabLogin");
const tabSignup = el("tabSignup");
const authLogin = el("authLogin");
const authSignup = el("authSignup");

const loginForm = el("loginForm");
const signupForm = el("signupForm");
const loginError = el("loginError");
const signupError = el("signupError");
const signupOk = el("signupOk");

// User pages
const goIELTS = el("goIELTS");
const goSAT = el("goSAT");
const viewUserExam = el("viewUserExam");
const examTitle = el("examTitle");
const userCrumb = el("userCrumb");
const backToUserHome = el("backToUserHome");
const folderGrid = el("folderGrid");

const viewUserFolder = el("viewUserFolder");
const folderTitle = el("folderTitle");
const folderCrumb = el("folderCrumb");
const backToExam = el("backToExam");
const searchVideos = el("searchVideos");
const videoGrid = el("videoGrid");

const player = el("player");
const playerTitle = el("playerTitle");
const playerMeta = el("playerMeta");
const playerDesc = el("playerDesc");
const playerBody = el("playerBody");
const closePlayer = el("closePlayer");

// Admin pages
const goFolders = el("goFolders");
const goUploads = el("goUploads");
const backToAdminHome1 = el("backToAdminHome1");
const backToAdminHome2 = el("backToAdminHome2");

const addFolderForm = el("addFolderForm");
const folderList = el("folderList");
const folderError = el("folderError");

const uploadForm = el("uploadForm");
const folderSelect = el("folderSelect");
const uploadError = el("uploadError");
const uploadOk = el("uploadOk");

const searchAdminVideos = el("searchAdminVideos");
const adminVideoList = el("adminVideoList");

let me = null;               // {role, username}
let folders = [];            // [{id, exam, name}]
let videos = [];             // enriched list
let currentExam = null;      // IELTS / SAT
let currentFolder = null;    // folder object

function showOnly(key) {
  Object.values(views).forEach((v) => v.classList.add("hidden"));
  views[key].classList.remove("hidden");
}

function setText(node, text) { node.textContent = text; }
function setError(node, msg) {
  if (!msg) node.classList.add("hidden");
  else { node.textContent = msg; node.classList.remove("hidden"); }
}
function setOk(node, msg) {
  if (!msg) node.classList.add("hidden");
  else { node.textContent = msg; node.classList.remove("hidden"); }
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: options.headers || {},
  });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function authHeader() {
  roleBadge.classList.toggle("hidden", !me);
  logoutBtn.classList.toggle("hidden", !me);
  if (me) roleBadge.textContent = me.role.toUpperCase();
}

function goHome() {
  if (!me) return showAuth();
  if (me.role === "admin") showOnly("adminHome");
  else showOnly("userHome");
}

function showAuth() {
  me = null;
  authHeader();
  showOnly("auth");
}

function selectTab(which) {
  const isLogin = which === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
  authLogin.classList.toggle("hidden", !isLogin);
  authSignup.classList.toggle("hidden", isLogin);
  setError(loginError, "");
  setError(signupError, "");
  setOk(signupOk, "");
}

async function loadMe() {
  try {
    me = await api("/api/me");
    authHeader();
    goHome();
  } catch {
    showAuth();
  }
}

async function loadFolders() {
  folders = await api("/api/folders");
  // sort: IELTS first, then SAT, then name
  folders.sort((a, b) => {
    if (a.exam !== b.exam) return a.exam === "IELTS" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

async function loadVideos(query = {}) {
  const params = new URLSearchParams(query);
  videos = await api(`/api/videos?${params.toString()}`);
  // newest first already, but keep consistent
  videos.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function renderFolderGrid(exam) {
  folderGrid.innerHTML = "";
  const list = folders.filter((f) => f.exam === exam);
  if (list.length === 0) {
    folderGrid.innerHTML = `<div class="muted">No folders yet. Ask admin to add some.</div>`;
    return;
  }

  for (const f of list) {
    const count = videos.filter((v) => v.folderId === f.id).length;
    const card = document.createElement("button");
    card.className = "folderCard";
    card.innerHTML = `
      <div class="folderName">${escapeHtml(f.name)}</div>
      <div class="folderMeta">${count} video(s)</div>
    `;
    card.onclick = () => openFolder(f);
    folderGrid.appendChild(card);
  }
}

function renderVideoGrid(list) {
  videoGrid.innerHTML = "";
  if (list.length === 0) {
    videoGrid.innerHTML = `<div class="muted">No videos in this folder yet.</div>`;
    return;
  }

  for (const v of list) {
    const card = document.createElement("div");
    card.className = "videoCard";
    card.innerHTML = `
      <div class="thumb">${v.kind === "audio" ? "MP3" : "VIDEO"}</div>
      <div class="videoTitle">${escapeHtml(v.title)}</div>
      <div class="videoMeta">${new Date(v.createdAt).toLocaleString()}</div>
    `;
    card.onclick = () => openPlayer(v);
    videoGrid.appendChild(card);
  }
}

function openExam(exam) {
  currentExam = exam;
  currentFolder = null;

  setText(examTitle, exam);
  setText(userCrumb, `Browse › ${exam}`);
  showOnly("userExam");

  // ensure videos loaded for this exam so counts are correct
  loadVideos({ exam }).then(() => renderFolderGrid(exam));
}

function openFolder(folder) {
  currentFolder = folder;

  setText(folderTitle, folder.name);
  setText(folderCrumb, `Browse › ${folder.exam} › ${folder.name}`);
  showOnly("userFolder");

  // load videos for this folder
  loadVideos({ folderId: folder.id }).then(() => {
    searchVideos.value = "";
    renderVideoGrid(videos);
  });

  closePlayerUI();
}

function openPlayer(v) {
  playerTitle.textContent = v.title;
  const mime = v.mime || "";
  const kind = v.kind || (mime.startsWith("video/") ? "video" : "audio");

  playerMeta.textContent = `${kind.toUpperCase()} • ${new Date(v.createdAt).toLocaleString()}`;
  playerDesc.textContent = v.description || "";
  playerBody.innerHTML = "";

  if (kind === "video") {
    playerBody.innerHTML = `<video controls preload="metadata" src="${v.url}"></video>`;
  } else {
    playerBody.innerHTML = `<audio controls preload="metadata" src="${v.url}"></audio>`;
  }

  player.classList.remove("hidden");
}

function closePlayerUI() {
  player.classList.add("hidden");
  playerBody.innerHTML = "";
}

function renderAdminFolders() {
  folderList.innerHTML = "";
  const list = [...folders];

  if (list.length === 0) {
    folderList.innerHTML = `<div class="muted">No folders yet. Add one above.</div>`;
    return;
  }

  for (const f of list) {
    const row = document.createElement("div");
    row.className = "item";

    const left = document.createElement("div");
    left.className = "itemLeft";
    left.innerHTML = `
      <div class="itemTitle">${escapeHtml(f.exam)} • ${escapeHtml(f.name)}</div>
      <div class="itemMeta">${f.updatedAt ? "Updated " + new Date(f.updatedAt).toLocaleString() : "Created " + new Date(f.createdAt).toLocaleString()}</div>
    `;

    const right = document.createElement("div");
    right.className = "row";

    const renameBtn = document.createElement("button");
    renameBtn.className = "btn";
    renameBtn.textContent = "Rename";
    renameBtn.onclick = async () => {
      const nm = prompt("New folder name:", f.name);
      if (!nm) return;
      try {
        await api(`/api/folders/${f.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nm }),
        });
        await refreshAdminData();
      } catch (e) {
        alert(e.message);
      }
    };

    const delBtn = document.createElement("button");
    delBtn.className = "btn";
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      if (!confirm(`Delete folder "${f.name}"? This will delete its videos too.`)) return;
      try {
        await api(`/api/folders/${f.id}`, { method: "DELETE" });
        await refreshAdminData();
      } catch (e) {
        alert(e.message);
      }
    };

    right.appendChild(renameBtn);
    right.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(right);
    folderList.appendChild(row);
  }
}

function renderFolderSelect() {
  folderSelect.innerHTML = "";
  if (folders.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No folders yet (create one first)";
    folderSelect.appendChild(opt);
    return;
  }

  for (const f of folders) {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = `${f.exam} › ${f.name}`;
    folderSelect.appendChild(opt);
  }
}

function renderAdminVideos(list) {
  adminVideoList.innerHTML = "";
  if (list.length === 0) {
    adminVideoList.innerHTML = `<div class="muted">No uploaded videos yet.</div>`;
    return;
  }

  for (const v of list) {
    const row = document.createElement("div");
    row.className = "item";

    const folderLabel = v.folder ? `${v.folder.exam} › ${v.folder.name}` : "(no folder)";

    const left = document.createElement("div");
    left.className = "itemLeft";
    left.innerHTML = `
      <div class="itemTitle">${escapeHtml(v.title)}</div>
      <div class="itemMeta">${escapeHtml(folderLabel)} • ${v.kind.toUpperCase()} • ${new Date(v.createdAt).toLocaleString()}</div>
      ${v.description ? `<div class="muted small">${escapeHtml(v.description)}</div>` : ""}
    `;

    const right = document.createElement("div");
    right.className = "row";

    const openBtn = document.createElement("a");
    openBtn.className = "btn primary";
    openBtn.textContent = "Open";
    openBtn.href = v.url;
    openBtn.target = "_blank";
    openBtn.rel = "noreferrer";

    const delBtn = document.createElement("button");
    delBtn.className = "btn";
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      if (!confirm("Delete this video?")) return;
      try {
        await api(`/api/videos/${v.id}`, { method: "DELETE" });
        await refreshAdminData();
      } catch (e) {
        alert(e.message);
      }
    };

    right.appendChild(openBtn);
    right.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(right);
    adminVideoList.appendChild(row);
  }
}

async function refreshAdminData() {
  await loadFolders();
  await loadVideos({});
  renderAdminFolders();
  renderFolderSelect();
  renderAdminVideos(videos);
}

function filterBySearch(list, q) {
  const s = String(q || "").trim().toLowerCase();
  if (!s) return list;
  return list.filter((v) =>
    (v.title || "").toLowerCase().includes(s) ||
    (v.description || "").toLowerCase().includes(s)
  );
}

// ---------- events ----------
homeBrand.addEventListener("click", goHome);

tabLogin.addEventListener("click", () => selectTab("login"));
tabSignup.addEventListener("click", () => selectTab("signup"));

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(loginError, "");
  const fd = new FormData(loginForm);
  const identifier = fd.get("identifier");
  const password = fd.get("password");

  try {
    await api("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    loginForm.reset();
    await loadMe();
  } catch (err) {
    setError(loginError, err.message);
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(signupError, "");
  setOk(signupOk, "");

  const fd = new FormData(signupForm);
  const username = fd.get("username");
  const email = fd.get("email");
  const password = fd.get("password");
  const confirm = fd.get("confirm");
  const adminCode = fd.get("adminCode");

  if (password !== confirm) {
    setError(signupError, "Passwords do not match");
    return;
  }

  try {
    await api("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, adminCode }),
    });
    signupForm.reset();
    setOk(signupOk, "Account created. Please log in.");
    selectTab("login");
  } catch (err) {
    setError(signupError, err.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST" });
  showAuth();
});

// User
goIELTS.addEventListener("click", async () => {
  await loadFolders();
  openExam("IELTS");
});

goSAT.addEventListener("click", async () => {
  await loadFolders();
  openExam("SAT");
});

backToUserHome.addEventListener("click", () => showOnly("userHome"));
backToExam.addEventListener("click", () => openExam(currentExam));

searchVideos.addEventListener("input", () => {
  renderVideoGrid(filterBySearch(videos, searchVideos.value));
});

closePlayer.addEventListener("click", closePlayerUI);

// Admin
goFolders.addEventListener("click", async () => {
  showOnly("adminFolders");
  await refreshAdminData();
});

goUploads.addEventListener("click", async () => {
  showOnly("adminUploads");
  await refreshAdminData();
  setError(uploadError, "");
  setOk(uploadOk, "");
});

backToAdminHome1.addEventListener("click", () => showOnly("adminHome"));
backToAdminHome2.addEventListener("click", () => showOnly("adminHome"));

addFolderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(folderError, "");
  const fd = new FormData(addFolderForm);
  const exam = fd.get("exam");
  const name = fd.get("name");

  try {
    await api("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exam, name }),
    });
    addFolderForm.reset();
    await refreshAdminData();
  } catch (err) {
    setError(folderError, err.message);
  }
});

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(uploadError, "");
  setOk(uploadOk, "");

  const fd = new FormData(uploadForm);

  try {
    const res = await fetch("/api/videos", { method: "POST", body: fd });
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await res.json() : null;
    if (!res.ok) throw new Error(data?.error || "Upload failed");

    uploadForm.reset();
    setOk(uploadOk, "Uploaded.");
    await refreshAdminData();
  } catch (err) {
    setError(uploadError, err.message);
  }
});

searchAdminVideos.addEventListener("input", () => {
  renderAdminVideos(filterBySearch(videos, searchAdminVideos.value));
});

// ---------- boot ----------
selectTab("login");
loadMe().then(async () => {
  if (me) {
    await loadFolders();
    if (me.role === "admin") await refreshAdminData();
  }
});
