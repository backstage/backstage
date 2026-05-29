---
'@backstage/catalog-client': patch
'@backstage/frontend-plugin-api': patch
---

Moved dependencies that are re-exported in the public API from `devDependencies` to `dependencies`. These were incorrectly demoted in #33936 because the source code only uses type imports, but the types still appear in the published API surface and need to be resolvable by consumers at build time.
