---
'@backstage/plugin-github-actions': patch
'@backstage/plugin-lighthouse': patch
'@backstage/plugin-techdocs': patch
---

Remove dependency on `@backstage/core-api`. No plugin should ever depend on that package; it's an internal concern whose important bits are re-exported by `@backstage/core` which is the public facing dependency to use.
