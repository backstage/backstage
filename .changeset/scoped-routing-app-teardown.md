---
'@backstage/frontend-defaults': patch
---

An app now releases the browser resources it holds, most notably its listener on browser history, when its React root is unmounted. This matters where apps are created and thrown away repeatedly in one process, such as tests and development tooling. An app that runs for the life of the page is unaffected.
