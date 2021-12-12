window.__wb_timing = {
  docStartAt: performance.now(),
  pageViewRequireAt: performance.now()
};

chrome.runtime.sendMessage(
  {
    type: 'pageView',
    url: window.location.href,
    referrer: document.referrer,
    title: document.title
  },
  pageViewId => {
    window.__wb_page_view_id = pageViewId;
  }
);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'isCommonLoaded') {
    sendResponse({loaded: !!window.webpackJsonp});
  }
});
document.addEventListener('DOMContentLoaded', () => {
  window.__wb_timing.DOMContentLoadedAt = performance.now();
});
