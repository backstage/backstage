---
'@backstage/frontend-app-api': patch
---

Fixed disabled external route bindings falling back to their default targets during link resolution.

Navigation analytics now use the most specific routed extension even when it has no route reference, including nested extensions with an empty path.
