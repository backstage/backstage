---
'@backstage/plugin-catalog': patch
---

Header in EntityLayout should always be shown.
Monitoring the loading status caused flickering when the refresh() method of the Async Entity was invoked.
