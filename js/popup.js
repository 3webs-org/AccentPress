(async () => {
  var accentPressId = "nfcdcdoegfnidkeldipgmhbabmndlhbf";
  
  var app = new Vue({
    el: '#app',
    data: {
      langConfig: await fetch("https://accentpress.pandapip1.com/config/languages.json").then(res => res.json()),
      langs: [ 'fr' ],
      options: { speed: 4 },
      detected: false
    },
    watch: {
      langs: {
        handler: function(val, oldVal) {
          chrome.runtime.sendMessage(
            accentPressId,
            {
              type: "SET_DATA",
              storage_data: {
                langs: this.langs,
                options: this.options
              }
            },
            function(response) { }
          );
        },
        deep: true
      },
      options: {
        handler: function(val, oldVal) {
          chrome.runtime.sendMessage(
            accentPressId,
            {
              type: "SET_DATA",
              storage_data: {
                langs: this.langs,
                options: this.options
              }
            },
            function(response) { }
          );
        },
        deep: true
      }
    }
  });

  chrome.runtime.sendMessage(
    accentPressId,
    {
      type: "GET_DATA"
    },
    function(response) {
      if (response.success){
        let data = response.storage_data;
        if (data && data.langs)
          app.langs = data.langs;
        if (data && data.options)
          app.options = data.options;
        app.detected = true;
      }
    }
  );
})();
