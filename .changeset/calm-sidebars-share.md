---
'@backstage/core-components': patch
---

Improved the rendering performance of sidebars with many items. Sidebar items now share their styles instead of each adding their own, and no longer re-render their content on every navigation.
