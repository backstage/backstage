---
'@backstage/plugin-catalog-react': patch
---

Deprecated EntityContext in favor of using `useEntity`, `EntityProvider` and the new `AsyncEntityProvider` instead. This update also brings cross-version compatibility to `@backstage/catalog-react`, meaning that future versions can be used in parallel with this one.
