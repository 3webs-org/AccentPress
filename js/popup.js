let langs = [
  'fr'
];
let options = {
  speed: 4
};

chrome.storage.sync.get(['langs', 'options'], (data) => {
  if (data && data.langs)
    langs = data.langs;
  if (data && data.options)
    options = data.options;
  langs.forEach(lang => {
    document.getElementById(lang).checked = true;
  });
  Object.keys(options).forEach(option => {
    document.getElementById(option).value = options[option];
  });
  chrome.storage.sync.set({
    langs: langs,
    options: options
  });
});

function addEventListeners(element, type, handler) {
  try {
    element.addEventListener(type, handler);
  } catch {}
  Array.from(element.elements).forEach(e => addEventListeners(e, type, handler));
};

addEventListeners(document.getElementById("languagesForm"), "change", event => {
  if (event.target.checked){
    langs.push(event.target.id);
  } else {
    langs = langs.filter(l => l !== event.target.id);
  }
  chrome.storage.sync.set({
    langs: langs,
    options: options
  });
});

addEventListeners(document.getElementById("optionsForm"), "change", event => {
  options[event.target.id] = event.target.value;
  chrome.storage.sync.set({
    langs: langs,
    options: options
  });
});
