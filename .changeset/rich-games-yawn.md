---
'@backstage/core': patch
---

Fix issue where `SidebarItem` with `onClick` and without `to` renders an inaccessible div. It now renders a button.
