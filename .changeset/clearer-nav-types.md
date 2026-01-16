---
'@backstage/frontend-plugin-api': patch
---

Mark `NavItem` and `NavContentItem` as `@public` and fix TSDoc. Refactors the exported `NavItem` type to a structural union to avoid forgotten-export warnings. No runtime behavior changes.
