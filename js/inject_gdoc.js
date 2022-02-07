// Modified from: https://github.com/birchill/10ten-ja-reader
console.info('[Accent Press] Accent Press is requesting Google Docs to use HTML rendering');

const scriptElem = document.createElement('script');
scriptElem.textContent = `(function() { window['_docs_force_html_by_ext'] = 'nfcdcdoegfnidkeldipgmhbabmndlhbf'; })();`;
(document.head || document.documentElement).append(scriptElem);
