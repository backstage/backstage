---
'@backstage/plugin-catalog-react': patch
---

Prevent permissions with types other than `ResourcePermission<'catalog-entity'>` from being used with the `useEntityPermission` hook.
