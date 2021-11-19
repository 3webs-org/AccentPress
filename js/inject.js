(async () => {
  chrome.storage.local.set({
    cache: {
      defaults: await fetch("https://accentpress.pandapip1.com/config/defaults.json").then(res => res.json()),
      raw_mappings: await fetch("https://accentpress.pandapip1.com/config/accents.json").then(res => res.json())
    }
  }).catch(() => {});
})();
(async () => {
  const cache = (await chrome.storage.local.get('cache')).cache;
  const settings = await chrome.storage.sync.get(null);
  const defaults = (cache && 'defaults' in cache) ? cache.defaults : await fetch("https://accentpress.pandapip1.com/config/defaults.json").then(res => res.json());
  const raw_mappings = (cache && 'raw_mappings' in cache) ? cache.raw_mappings : await fetch("https://accentpress.pandapip1.com/config/accents.json").then(res => res.json());
  
  const speed = (settings && 'options' in settings && 'speed' in settings.options) ? parseInt(settings.options.speed) : defaults.options.speed;
  let og_langs = (settings && 'langs' in settings) ? settings.langs : defaults.langs;
  
  let opengraph_lang = document.querySelector("meta[property='og:locale']") ? document.querySelector("meta[property='og:locale']").getAttribute('content') : null;
  if (opengraph_lang) og_langs.push(opengraph_lang);
  if (document.documentElement.lang) og_langs.push(document.documentElement.lang);
  const langs = og_langs;
  // Update Mappings
  const mappings = {};
  
  function addAccent(baselet, letter) {
    if (!mappings[baselet]) {
      mappings[baselet] = {};
      mappings[baselet][baselet] = baselet;
    }
    
    if (!mappings[baselet][letter]) Object.keys(mappings[baselet]).forEach(letter2replace => {
      if (mappings[baselet][letter2replace] == baselet) {
        mappings[baselet][letter2replace] = letter;
        mappings[baselet][letter] = baselet;
      }
    });
  }
  
  const raw_mappings_filt = Object.keys(raw_mappings).filter(lang => langs.indexOf(lang) > -1).map(lang => raw_mappings[lang]);
  raw_mappings_filt.forEach(lang => lang.forEach(letters => letters.forEach(letter => addAccent(letters[0], letter))));
  raw_mappings_filt.forEach(lang => lang.forEach(letters => letters.forEach(letter => addAccent(letters[0].toUpperCase(), letter.toUpperCase()))));
  
  // Actual extension
  const active = {};
  const toggle = {};
  let prev = 0;
  document.addEventListener("keydown", e => {
    // Select only events that should be captured
    if (!e || !e.key || !e.target || !("selectionStart" in e.target) || !("value" in e.target) || !(e.key in mappings)) return;
    let isActive = active[e.key];
    active[e.key] = true;
    if (!isActive) return;
    let replacement = mappings[e.key][e.target.value[e.target.selectionStart-1]];
    if (!replacement) return;
    // Only toggle letter every speed
    e.preventDefault();
    if (new Date().getTime() < prev + speed*120) return;
    prev = new Date().getTime();
    // Replace letter
    e.target.selectionStart -= 1;
    var start = e.target.selectionStart;
    var finish = e.target.selectionEnd;
    var allText = e.target.value;
    var sel = allText.substring(start, finish);
    var newText = allText.substring(0, start)+replacement+allText.substring(finish, allText.length);
    e.target.value = newText;
    e.target.selectionStart = finish;
    e.target.selectionEnd = finish;
  });
  
  document.addEventListener("keyup", e => {
    active[e.key] = false;
    toggle[e.key] = 0;
  });
})();
