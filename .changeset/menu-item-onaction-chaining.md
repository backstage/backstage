---
'@backstage/ui': patch
---

Fixed MenuItem `onAction` prop ordering so user-provided `onAction` handlers are chained rather than silently overwritten.
