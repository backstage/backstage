---
'@backstage/plugin-cost-insights': patch
---

Removed @backstage/test-utils dependency, since it was already in the devDependencies where it belongs. The main benefit is that this will exclude better-sqlite3 from the production build.
