---
'@backstage/ui': patch
---

Fixed Table Row component to correctly handle cases where no `href` is provided, preventing unnecessary router provider wrapping and fixing the cursor incorrectly showing as a pointer despite the element not being a link.
