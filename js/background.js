async function track(event, props) {
  // Token ID
  let token = "a17adb469eb6c2dd0e78217022de6e9d";
  // Generate random strings
  function genID(){
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (;str.length < 24;) str += characters.charAt(Math.random() * characters.length);
    return str;
  }
  // Generate user ID
  let user_id = (await chrome.storage.sync.get('user_id')).user_id;
  if (!user_id) {
    user_id = genID();
    await chrome.storage.sync.set({ user_id });
  }
  // Generate properties object
  let properties = Object.assign(Object.assign({}, props), {
    "time":        Date.now() / 1000 | 0, // Timestamp in seconds
    "distinct_id": user_id,               // User ID
    "$insert_id":  genID(),               // Generate Event ID
    "token":       token                  // Tracking Token
  });
  // Send event
  return await fetch("https://api.mixpanel.com/track", {
    "method": "POST",
    "headers": {
      "Accept": "text/plain",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "body": new URLSearchParams({
      "data": JSON.stringify({ event, properties }),
      "verbose": 1
    })
  }).then(response => response.json());
}

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
    // Fetch data
    let storage_data = await chrome.storage.sync.get(null);
    // Send tracking event
    await track('settings_open', {});
    // Send response
    sendResponse({
      success: true,
      storage_data: {
        langs: storage_data.langs ? storage_data.langs : null,
        options: {
          speed: storage_data.options.speed ? storage_data.options.speed : null
        }
      }
    });
  }
  if (request.type == "SET_DATA") {
    // Fetch data
    let storage_data_local = await chrome.storage.local.get(null);
    let storage_data_old = await chrome.storage.sync.get(null);
    let storage_data_new = request.storage_data;
    // Set new data
    await chrome.storage.sync.set({
      langs: storage_data_new.langs,
      options: storage_data_new.options
    });
    // Get tracking data
    let defaults = (storage_data_local.cache && 'defaults' in storage_data_local.cache) ? storage_data_local.cache.defaults : await fetch("https://accentpress.pandapip1.com/config/defaults.json").then(res => res.json());
    let speed_old = (storage_data_old && 'options' in storage_data_old && 'speed' in storage_data_old.options) ? parseInt(storage_data_old.options.speed) : defaults.options.speed;
    let langs_old = (storage_data_old && 'langs' in storage_data_old) ? storage_data_old.langs : defaults.langs;
    let speed_new = (storage_data_new && 'options' in storage_data_new && 'speed' in storage_data_new.options) ? parseInt(storage_data_new.options.speed) : defaults.options.speed;
    let langs_new = (storage_data_new && 'langs' in storage_data_new) ? storage_data_new.langs : defaults.langs;
    // Send tracking event
    await track('settings_change', {
      local_storage: storage_data_local,
      sync_storage: storage_data_new,
      sync_storage_old: storage_data_old,
      speed_old: speed_old,
      speed_new: speed_old,
      chg_speed: speed_new-speed_old,
      langs_old: langs_old,
      langs_new: langs_new,
      langs_add: langs_new.filter(x => langs_old.indexOf(x) < 0),
      langs_rem: langs_old.filter(x => langs_new.indexOf(x) < 0)
    });
    // Send response
    sendResponse({
      success: true
    });
  }
  if (request.type == "RESET_DATA") {
    // Fetch data
    let storage_data_local = await chrome.storage.local.get(null);
    let storage_data_sync = await chrome.storage.sync.get(null);
    // Clear storage
    await chrome.storage.local.clear();
    await chrome.storage.sync.clear();
    // Send tracking event
    await track('settings_clear', {
      local_storage: storage_data_local,
      sync_storage: storage_data_sync
    });
    // Send response
    sendResponse({
      success: true
    });
  }
});
