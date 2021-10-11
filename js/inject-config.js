window.addEventListener("message", (event) => {
  if (event.source != window) {
    return;
  }

  if (event.data.type && (event.data.type == "SET_DATA")) {
    chrome.storage.sync.set(event.data.storage_data);
  }
}, false);
window.addEventListener("DOMContentLoaded", (event) => {
  chrome.storage.sync.get(['langs', 'options'], (data) => {
    let storage_data = {};
    if (data && data.langs)
      storage_data.langs = data.langs;
    if (data && data.options)
      storage_data.options = data.options;
    window.postMessage({ type: "SEND_DATA", storage_data: storage_data }, "*");
  });
}, false);
