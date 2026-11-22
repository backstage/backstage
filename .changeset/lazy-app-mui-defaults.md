---
'@backstage/plugin-app': patch
---

The default theme icons, error display, progress, not-found page and icon set now load their Material UI dependencies only when they render. Apps that replace these defaults no longer bundle Material UI for them.
