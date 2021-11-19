let setData = (accentPressId, storage_data) => new Promise((resolutionFunc, rejectionFunc) => chrome.runtime.sendMessage(
  accentPressId,
  {
    type: "SET_DATA",
    storage_data: storage_data
  },
  response => response.success ? resolutionFunc() : rejectionFunc()
));
let getData = (accentPressId) => new Promise((resolutionFunc, rejectionFunc) => chrome.runtime.sendMessage(
  accentPressId,
  {
    type: "GET_DATA"
  },
  response => response.success ? resolutionFunc(response.storage_data) : rejectionFunc()
));

let app = new Vue({
  el: '#app',
  data: {
    langConfig: {},
    langs: [],
    options: {
      speed: 0
    },
    accentPressId: "nfcdcdoegfnidkeldipgmhbabmndlhbf",
    detected: false
  },
  watch: {
    langs: {
      handler: () => app.detected ? setData(app.accentPressId, { langs: app.langs, options: app.options }) : null,
      deep: true
    },
    options: {
      handler: () => app.detected ? setData(app.accentPressId, { langs: app.langs, options: app.options }) : null,
      deep: true
    }
  }
});

(async () => {
  app.langConfig = await fetch("https://accentpress.pandapip1.com/config/languages.json").then(res => res.json());
})();
(async () => {
  let defaultOpts = await fetch("https://accentpress.pandapip1.com/config/defaults.json").then(res => res.json());
  if (!app.langs) app.langs = defaultOpts.langs;
  if (!app.options.speed) app.options = defaultOpts.options;
})();
(async () => {
  try {
    let settings = await getData(app.accentPressId);
    app.detected = true;
    if (settings && settings.langs) app.langs = settings.langs;
    if (settings && settings.options) app.options = settings.options;
  } catch { }
})();
