chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
  if (request.type == "GET_DATA") {
    sendResponse({ success: true, storage_data: await chrome.storage.sync.get(null) });
  }
  if (request.type == "SET_DATA") {
    await chrome.storage.sync.set(request.storage_data);
    sendResponse({ success: true });
  }
});

chrome.action.onClicked.addListener(() => chrome.tabs.create({'url': "https://accentpress.pandapip1.com/html/popup.html", 'selected': true}));
