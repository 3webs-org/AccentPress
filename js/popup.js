(async () => {
  var app = new Vue({
    el: '#app',
    data: {
      langConfig: await fetch("https://accentpress.pandapip1.com/config/languages.json").then(res => res.json()),
      langs: [ 'fr' ],
      options: { speed: 4 }
    },
    computed: {
      update: function(){
        alert(JSON.stringify({
          langs: this.langs,
          options: this.options
        }));
        chrome.storage.sync.set({
          langs: this.langs,
          options: this.options
        });
        return "Saved";
      }
    },
    watch: {
      $data: {
          handler: function(val, oldVal) {
              alert(JSON.stringify(val));
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
