(async () => {
  var app = new Vue({
    el: '#app',
    data: {
      langConfig: await fetch("https://accentpress.pandapip1.com/config/languages.json").then(res => res.json()),
      langs: [ 'fr' ],
      options: { speed: 4 }
    },
    watch: {
      langs: {
        handler: function(val, oldVal) {
          chrome.storage.sync.set({
            langs: this.langs,
            options: this.options
          });
        },
        deep: true
      },
      options: {
        handler: function(val, oldVal) {
          chrome.storage.sync.set({
            langs: this.langs,
            options: this.options
          });
        },
        deep: true
      }
    }
  });

  chrome.storage.sync.get(['langs', 'options'], (data) => {
    if (data && data.langs)
      app.langs = data.langs;
    if (data && data.options)
      app.options = data.options;
  });
})();
