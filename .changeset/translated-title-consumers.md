---
'@backstage/plugin-app': patch
---

Navigation, page headers, tabs, and breadcrumbs now resolve optional title translation references through the app translation API. Language changes update titles and sorting while preserving page state. Each group waits for its initial selected-language translations before rendering, then retains its resolved titles until the next language is ready. Pages excluded from navigation do not delay navigation title updates.
