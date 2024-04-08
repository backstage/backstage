---
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-catalog': patch
---

- Fixed a bug in DefaultEntityPresentationApi that was not using default context to parse entityOrRef which led to undefined Kind and wrong entityRef when using entityPresentationApi
- Changed the way to display entities in EntityPicker to use entityPresentationApi instead of humanizeEntityRef, stringifyEntityRef and parseEntityRef
