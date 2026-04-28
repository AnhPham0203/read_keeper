/* global chrome */
"use strict";

// ── Meta helper ────────────────────────────────────────────────────────────
function getMeta(property) {
  const el =
    document.querySelector(`meta[property="${property}"]`) ||
    document.querySelector(`meta[name="${property}"]`);
  return (el && el.getAttribute("content")) || "";
}

// First matching selector's innerText, or ""
function firstText(...selectors) {
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim()) return el.innerText.trim();
    } catch (_) { /* bad selector on some pages — skip */ }
  }
  return "";
}

// ── Facebook extractor ─────────────────────────────────────────────────────
function extractFacebook() {
  const ogTitle = getMeta("og:title");
  const ogImage = getMeta("og:image");

  // Post body — Facebook rewrites class names constantly; cast a wide net
  const content = firstText(
    '[data-ad-preview="message"]',
    '[data-testid="post_message"]',
    "div[dir='auto'] > div[dir='auto']",
    ".userContent p",
    ".userContent",
    "div[class*='userContent']",
    "div[data-testid='story-subtitle'] + div",
    // newer React-rendered posts
    "div[class=''] div[dir='auto']",
    "div[role='article'] div[dir='auto']"
  );

  const author = firstText(
    "h2 a[role='link']",
    "strong > a",
    "h2 strong",
    ".actor-name",
    "a[data-testid='story-author']",
    "div[role='article'] a[role='link']:first-of-type"
  );

  const title = ogTitle || (content ? content.slice(0, 100) : document.title);

  return { title, content, author, thumbnail_url: ogImage, source: "facebook" };
}

// ── Substack extractor ─────────────────────────────────────────────────────
function extractSubstack() {
  const title = firstText(
    "h1.post-title",
    "h1[class*='post-title']",
    ".post-title",
    "h1"
  ) || getMeta("og:title") || document.title;

  const content = firstText(
    "div.body.markup",
    "div[class*='body'][class*='markup']",
    ".post-content",
    "div[class*='post-content']",
    "article"
  );

  const author = firstText(
    ".post-header .author-name",
    ".byline-name",
    "a[class*='author']",
    ".author-name",
    'a[href*="/p/"] + span', // some layouts
    ".byline a"
  );

  return {
    title,
    content,
    author,
    thumbnail_url: getMeta("og:image"),
    source: "substack",
  };
}

// ── Generic extractor ──────────────────────────────────────────────────────
function extractOther() {
  const title = getMeta("og:title") || getMeta("twitter:title") || document.title;

  const content = firstText(
    "article",
    "main article",
    "main",
    '[role="main"]',
    ".post-body",
    ".entry-content",
    "#content"
  );

  const author = firstText(
    '[rel="author"]',
    ".author",
    '[class*="author-name"]',
    '[itemprop="author"]'
  );

  return {
    title,
    content,
    author,
    thumbnail_url: getMeta("og:image") || getMeta("twitter:image"),
    source: "other",
  };
}

// ── Excerpt helper ─────────────────────────────────────────────────────────
function makeExcerpt(content) {
  if (!content) return "";
  const plain = content.replace(/\s+/g, " ").trim();
  return plain.length > 200 ? plain.slice(0, 200) + "…" : plain;
}

// ── Main extractor ─────────────────────────────────────────────────────────
function extractPageData() {
  const url = window.location.href;
  let data;

  if (url.includes("facebook.com")) {
    data = extractFacebook();
  } else if (url.includes("substack.com")) {
    data = extractSubstack();
  } else {
    data = extractOther();
  }

  return {
    url,
    title:         data.title   || document.title,
    content:       data.content || "",
    excerpt:       makeExcerpt(data.content),
    author:        data.author  || "",
    thumbnail_url: data.thumbnail_url || "",
    source:        data.source,
  };
}

// ── Message listener ───────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "GET_PAGE_INFO" || msg.action === "getPageData") {
    sendResponse(extractPageData());
  }
  return true; // keep channel open
});
