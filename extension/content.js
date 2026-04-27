/* global chrome */
// Responds to popup requests with basic page info.
// JOB-007 will expand this to extract article content.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "GET_PAGE_INFO") {
    sendResponse({
      url:   window.location.href,
      title: document.title,
    });
  }
  return true; // keep channel open for async response
});
