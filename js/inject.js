// Update cache, fail silently
(async () => {
  chrome.storage.local.set({
    cache: {
      defaults: await fetch("https://accentpress.pandapip1.com/config/defaults.json").then(res => res.json()),
      raw_mappings: await fetch("https://accentpress.pandapip1.com/config/accents.json").then(res => res.json())
    }
  }).catch(() => {});
})();

// Main accent press code
(async () => {
  // Get raw settings
  const cache = (await chrome.storage.local.get('cache')).cache;
  const settings = await chrome.storage.sync.get(null);
  const defaults = (cache && 'defaults' in cache) ? cache.defaults : await fetch("https://accentpress.pandapip1.com/config/defaults.json").then(res => res.json());
  const raw_mappings = (cache && 'raw_mappings' in cache) ? cache.raw_mappings : await fetch("https://accentpress.pandapip1.com/config/accents.json").then(res => res.json());
  
  // Get speed & language settings
  let speed = (settings && 'options' in settings && 'speed' in settings.options) ? parseInt(settings.options.speed) : defaults.options.speed;
  let langs = (settings && 'langs' in settings) ? settings.langs : defaults.langs;
  
  // Set languages based on document metadata (og:locale meta & lang tag)
  let opengraph_lang = document.querySelector("meta[property='og:locale']") ? document.querySelector("meta[property='og:locale']").getAttribute('content') : null;
  if (opengraph_lang) langs.push(opengraph_lang);
  if (document.documentElement.lang) langs.push(document.documentElement.lang);
  
  // Generate Mappings
  const mappings = {};
  
  // Helper function to add an accent
  function addAccent(baselet, letter) {
    if (!mappings[baselet]) { // If the base letter is unknown, add it
      mappings[baselet] = {};
      mappings[baselet][baselet] = baselet; // Temporarily set it to itself
    }
    // If the new letter hasn't been added yet, add it
    if (!mappings[baselet][letter]) Object.keys(mappings[baselet]).forEach(letter2replace => {
      if (mappings[baselet][letter2replace] == baselet) { // If this is the key to replace, replace it
        mappings[baselet][letter2replace] = letter;
        mappings[baselet][letter] = baselet;
      }
    });
  }
  
  // Add the mappings
  const raw_mappings_filt = Object.keys(raw_mappings).filter(lang => langs.indexOf(lang) > -1).map(lang => raw_mappings[lang]);
  raw_mappings_filt.forEach(lang => lang.forEach(letters => letters.forEach(letter => {
    addAccent(letters[0], letter); // Add lowercase letter
    addAccent(letters[0].toUpperCase(), letter.toUpperCase()); // Add uppercase letter
  })));
  
  // Create state variables
  const active = {};
  const toggle = {};
  let prev = 0;
  
  // Type accents when a key is held down
  document.addEventListener("keydown", e => {
    // Initially select only events that should be captured
    if (!e) return; // If the event is somehow undefined, skip
    
    // Get important properties
    let isRawInput = e.target && "value" in e.target; // Get if it is an <input> or a contenteditable=true
    let target = isRawInput ? e.target : window.getSelection().getRangeAt(0).startContainer; // Get the container
    let selectionStart = isRawInput ? target.selectionStart : window.getSelection().getRangeAt(0).startOffset; // Start offset of cursor
    let selectionEnd = isRawInput ? target.selectionStart : window.getSelection().getRangeAt(0).startOffset; // End offset of cursor
    let propVal = isRawInput ? "value" : "innerHTML"; // Property containing text
    let key = e.key; // The letter key that is held
    
    // Select only events that should be captured
    if (!target) return; // If no target selected, skip
    if (!key) return; // If no key held, skip
    if (!selectionStart) return; // If no text selected, skip
    if (!selectionEnd) return; // If no text selected, skip
    if (!target[propVal]) return; // If the target doesn't have the right property, skip
    if (!(key in mappings)) return; // If the key isn't in the mappings, skip
    if (!isRawInput && !window.getSelection().getRangeAt(0).collapsed) return; // If the selection isn't collapsed, skip
    
    // Do it only if the key is held down
    let isActive = active[key]; // Get if the key was previously held down
    active[key] = true; // Set the key to be held down for future reference
    if (!isActive) return; // Skip if it wasn't held down
    
    // At this point, prevent the letter from being typed
    e.preventDefault();
    
    // Only toggle letter every 'speed'
    if (new Date().getTime() < prev + speed * 120) return; // Skip if the timing is wrong
    prev = Math.floor(new Date().getTime() / (speed * 120)) * (speed * 120) + (prev % (speed * 120)); // Update to current time
    
    // Get bounds
    var start = selectionStart - 1;
    var finish = selectionEnd;
    
    // Get letter to replace with
    let replacement = mappings[key][target[propVal][start]]; // Get replacement
    if (!replacement) return; // If wacky stuff is going on with false mappings, don't error
    
    // Get text & replace it
    var allText = target[propVal];
    var sel = allText.substring(start, finish);
    var newText = allText.substring(0, start) + replacement + allText.substring(finish, allText.length);
    target[propVal] = newText;
    
    // Move the cursor
    if (isRawInput) {
      target.selectionStart = finish;
      target.selectionEnd = finish;
    } else {
      window.getSelection().collapseToEnd();
    }
  });
  
  // Save the state 
  document.addEventListener("keyup", e => {
    active[e.key] = false;
    toggle[e.key] = 0;
  });
})();
