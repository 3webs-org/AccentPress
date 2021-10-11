chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "GET_DATA") {
      chrome.storage.sync.get(['langs', 'options'], (data) => {
        let storage_data = {};
        if (data && data.langs)
          storage_data.langs = data.langs;
        if (data && data.options)
          storage_data.options = data.options;
        sendResponse({ success: true, storage_data: storage_data });
      });
    }
    if (request.type == "SET_DATA") {
      chrome.storage.sync.set(request.storage_data);
      sendResponse({ success: true });
    }
  }
);

chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': "https://accentpress.pandapip1.com/html/popup.html", 'selected': true});
});
