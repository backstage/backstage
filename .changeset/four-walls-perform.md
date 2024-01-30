---
'@backstage/plugin-scaffolder': minor
---

Scaffolding - EntityPicker component - now it does not load full entity data, only a specified set - defaults to `['metadata.name', 'metadata.namespace', 'metadata.title', 'kind']`. It can significantly reduce loaded time bigger data set. It's possible to set fields to ignore configure via `fieldsToIgnore` in UI options of the EntityPicker component.
