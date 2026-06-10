---
'@backstage/core-components': patch
---

Lazy-load `react-syntax-highlighter` and `@dagrejs/dagre` so they are no longer pulled in eagerly through the barrel export. This reduces the upfront module cost of importing from `@backstage/core-components` by roughly 10 MB. The public API is unchanged.
