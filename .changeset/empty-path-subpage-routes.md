---
'@backstage/frontend-app-api': patch
---

Fixed sub-pages with an empty path not rendering for paths below them, such as a detail route inside an index tab. The catch-all route that every page gets is now ranked after the page's own sub-pages.
