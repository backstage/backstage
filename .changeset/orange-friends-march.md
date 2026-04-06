---
'@backstage/plugin-search': patch
---

Fixed the `SearchModal` leaving the page in a broken state by not restoring body overflow and aria-hidden attributes when closing.
