chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        var uninstallUrlLink = 'https://forms.gle/h2djLMjEC88oK1vq9';
        if (chrome.runtime.setUninstallURL) {
            chrome.runtime.setUninstallURL(uninstallUrlLink);
        }
    }
});

chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
  if (request.type == "GET_DATA") {
    sendResponse({ success: true, storage_data: await chrome.storage.sync.get(null) });
  }
  if (request.type == "SET_DATA") {
    await chrome.storage.sync.set(request.storage_data);
    sendResponse({ success: true });
  }
  if (request.type == "RESET_DATA") {
    await chrome.storage.local.clear();
    await chrome.storage.sync.clear();
    sendResponse({ success: true });
  }
});
