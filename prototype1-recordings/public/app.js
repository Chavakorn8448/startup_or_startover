const el = (id) => document.getElementById(id);

const viewLogin = el("viewLogin");
const viewLanding = el("viewLanding");
const viewRecordings = el("viewRecordings");

const roleBadge = el("roleBadge");
const logoutBtn = el("logoutBtn");

const welcomeTitle = el("welcomeTitle");
const goRecordingsBtn = el("goRecordingsBtn");
const backBtn = el("backBtn");

const loginForm = el("loginForm");
const loginError = el("loginError");

const adminPanel = el("adminPanel");
const uploadForm = el("uploadForm");
const uploadError = el("uploadError");

const recordingsList = el("recordingsList");

const player = el("player");
const playerTitle = el("playerTitle");
const playerDesc = el("playerDesc");
const audio = el("audio");

let currentRole = null;

function show(view) {
  [viewLogin, viewLanding, viewRecordings].forEach(v => v.classList.add("hidden"));
  view.classList.remove("hidden");
}

function setError(node, msg) {
  if (!msg) node.classList.add("hidden");
  else {
    node.textContent = msg;
    node.classList.remove("hidden");
  }
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

async function loadMe() {
  try {
    const me = await api("/api/me");
    currentRole = me.role;

    roleBadge.textContent = me.role.toUpperCase();
    roleBadge.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");

    welcomeTitle.textContent = `Welcome, ${me.role}`;
    adminPanel.classList.toggle("hidden", me.role !== "admin");

    show(viewLanding);
  } catch {
    currentRole = null;
    roleBadge.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    show(viewLogin);
  }
}

async function loadRecordings() {
  recordingsList.innerHTML = "";
  player.classList.add("hidden");
  audio.src = "";

  const list = await api("/api/recordings");

  if (list.length === 0) {
    recordingsList.innerHTML = `<div class="muted">No recordings yet.</div>`;
    return;
  }

  for (const item of list) {
    const row = document.createElement("div");
    row.className = "item";

    const left = document.createElement("div");
    left.className = "itemLeft";
    left.innerHTML = `
      <div class="itemTitle">${escapeHtml(item.title)}</div>
      <div class="itemMeta">${new Date(item.createdAt).toLocaleString()}</div>
      ${item.description ? `<div class="muted">${escapeHtml(item.description)}</div>` : ""}
    `;

    const right = document.createElement("div");
    right.className = "row";

    const playBtn = document.createElement("button");
    playBtn.className = "btn primary";
    playBtn.textContent = "Play";
    playBtn.onclick = () => {
      playerTitle.textContent = item.title;
      playerDesc.textContent = item.description || "";
      audio.src = item.url;
      player.classList.remove("hidden");
      audio.play().catch(() => {});
    };

    right.appendChild(playBtn);

    if (currentRole === "admin") {
      const delBtn = document.createElement("button");
      delBtn.className = "btn";
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        if (!confirm("Delete this recording?")) return;
        await api(`/api/recordings/${item.id}`, { method: "DELETE" });
        await loadRecordings();
      };
      right.appendChild(delBtn);
    }

    row.appendChild(left);
    row.appendChild(right);
    recordingsList.appendChild(row);
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// --- Events ---

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(loginError, "");

  const fd = new FormData(loginForm);
  const username = fd.get("username");
  const password = fd.get("password");

  try {
    const out = await api("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    currentRole = out.role;
    await loadMe();
  } catch (err) {
    setError(loginError, err.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST" });
  await loadMe();
});

goRecordingsBtn.addEventListener("click", async () => {
  show(viewRecordings);
  await loadRecordings();
});

backBtn.addEventListener("click", () => {
  show(viewLanding);
});

uploadForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(uploadError, "");

  const fd = new FormData(uploadForm);

  try {
    const res = await fetch("/api/recordings", { method: "POST", body: fd });
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await res.json() : null;
    if (!res.ok) throw new Error(data?.error || "Upload failed");

    uploadForm.reset();
    await loadRecordings();
  } catch (err) {
    setError(uploadError, err.message);
  }
});

// Boot
loadMe();
