---
'@backstage/ui': patch
---

Improved `useBreakpoint` performance by sharing a single set of `matchMedia` listeners across all component instances instead of creating independent listeners per hook call.
