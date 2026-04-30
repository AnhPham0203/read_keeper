/* global chrome */
"use strict";

// ── State ──────────────────────────────────────────────────────────────────
let tags = [];
let pageUrl = "";
let pageData = {}; // enriched data from content.js

// ── DOM refs ───────────────────────────────────────────────────────────────
const mainView      = document.getElementById("main-view");
const settingsView  = document.getElementById("settings-view");
const titleInput    = document.getElementById("title-input");
const tagInput      = document.getElementById("tag-input");
const tagPillsEl    = document.getElementById("tag-pills");
const saveBtn       = document.getElementById("save-btn");
const statusEl      = document.getElementById("status");
const settingsBtn   = document.getElementById("settings-btn");
const apiUrlInput   = document.getElementById("api-url-input");
const tokenInput    = document.getElementById("token-input");
const saveSettingsBtn = document.getElementById("save-settings-btn");

// ── Init ───────────────────────────────────────────────────────────────────
chrome.storage.sync.get(["apiUrl", "authToken"], ({ apiUrl, authToken }) => {
  apiUrlInput.value = apiUrl || "";
  tokenInput.value  = authToken || "";

  if (!apiUrl) {
    showView("settings");
    return;
  }

  // Populate page info from the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    pageUrl = tab.url || "";
    titleInput.value = tab.title || "";
    pageData = { url: pageUrl, title: tab.title || "", source: detectSource(pageUrl) };

    // Ask content script for full extracted metadata
    chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_INFO" }, (res) => {
      if (chrome.runtime.lastError || !res) return;
      pageData = { ...pageData, ...res };
      if (res.title) titleInput.value = res.title;
      if (res.url)   pageUrl = res.url;
    });
  });
});

// ── View helpers ───────────────────────────────────────────────────────────
function showView(name) {
  mainView.hidden     = name !== "main";
  settingsView.hidden = name !== "settings";
}

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className   = `status status-${type}`;
}

// ── Settings ───────────────────────────────────────────────────────────────
settingsBtn.addEventListener("click", () => {
  chrome.storage.sync.get(["apiUrl", "authToken"], ({ apiUrl, authToken }) => {
    apiUrlInput.value = apiUrl || "";
    tokenInput.value  = authToken || "";
    showView("settings");
  });
});

saveSettingsBtn.addEventListener("click", () => {
  const apiUrl    = apiUrlInput.value.trim().replace(/\/+$/, "");
  const authToken = tokenInput.value.trim();

  if (!apiUrl) {
    apiUrlInput.focus();
    return;
  }

  chrome.storage.sync.set({ apiUrl, authToken }, () => {
    showView("main");
    setStatus("✅ Đã lưu cài đặt", "success");
  });
});

// ── Tag management ─────────────────────────────────────────────────────────
function renderTags() {
  tagPillsEl.innerHTML = "";
  tags.forEach((tag, i) => {
    const pill = document.createElement("span");
    pill.className = "tag-pill";
    pill.innerHTML =
      `${escHtml(tag)}<button class="tag-remove" data-i="${i}" aria-label="Xóa tag">×</button>`;
    tagPillsEl.appendChild(pill);
  });
}

tagPillsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".tag-remove");
  if (!btn) return;
  tags.splice(Number(btn.dataset.i), 1);
  renderTags();
});

tagInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const val = tagInput.value.trim();
  if (val && !tags.includes(val)) {
    tags.push(val);
    renderTags();
  }
  tagInput.value = "";
});

// ── Save ───────────────────────────────────────────────────────────────────
saveBtn.addEventListener("click", () => {
  chrome.storage.sync.get(["apiUrl", "authToken"], async ({ apiUrl, authToken }) => {
    if (!apiUrl)    return setStatus("❌ Chưa cấu hình API URL", "error");
    if (!authToken) return setStatus("❌ Chưa cấu hình Auth Token", "error");

    const title = titleInput.value.trim();
    if (!title) {
      setStatus("❌ Cần có tiêu đề", "error");
      titleInput.focus();
      return;
    }

    saveBtn.disabled    = true;
    saveBtn.textContent = "Đang lưu…";
    setStatus("", "");

    try {
      const res = await fetch(`${apiUrl}/api/save`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...pageData,   // content, author, thumbnail_url, source from extractor
          url:   pageUrl,
          title,         // user-edited title takes precedence
          tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ Lỗi ${res.status}: ${data.error || "unknown"}`, "error");
        resetSaveBtn();
      } else if (data.duplicate) {
        setStatus("⚠️ Đã có trong thư viện", "warn");
        resetSaveBtn();
      } else {
        setStatus("✅ Đã lưu!", "success");
        saveBtn.textContent = "✓ Đã lưu";
        setTimeout(() => window.close(), 1500);
      }
    } catch {
      setStatus("❌ Không kết nối được server", "error");
      resetSaveBtn();
    }
  });
});

function resetSaveBtn() {
  saveBtn.disabled    = false;
  saveBtn.textContent = "💾 Lưu bài này";
}

// ── Utilities ──────────────────────────────────────────────────────────────
function detectSource(url) {
  if (!url) return "other";
  if (url.includes("facebook.com")) return "facebook";
  if (url.includes("substack.com"))  return "substack";
  return "other";
}

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
