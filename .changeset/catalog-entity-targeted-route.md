---
'@backstage/plugin-catalog-react': patch
---

The shared entity route reference now targets `page:catalog/entity` in the new frontend system. Its existing identity and legacy mount support are preserved, including when an older package version initializes the reference first.
