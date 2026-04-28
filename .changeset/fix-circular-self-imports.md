---
'@backstage/frontend-plugin-api': patch
'@backstage/catalog-model': patch
'@backstage/core-plugin-api': patch
'@backstage/plugin-catalog-node': patch
'@backstage/plugin-kubernetes-common': patch
'@backstage/plugin-kubernetes-node': patch
---

Removed a handful of internal imports that referenced the package by its own name. Value imports were switched to relative paths, and type-only imports to `import type`. These self-referential imports could trigger circular initialization errors in bundled ESM and when the package was loaded via `jest.requireActual` — most visibly `Cannot access '_AppRootElementBlueprintesm' before initialization` from `@backstage/frontend-plugin-api`. There are no user-facing API changes.
