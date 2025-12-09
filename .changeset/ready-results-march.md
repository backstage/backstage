---
'@backstage/plugin-catalog': patch
---

Fixed `catalogAboutEntityCard` to filter icon links before calling useProps(), preventing side effects from hooks in filtered-out links
