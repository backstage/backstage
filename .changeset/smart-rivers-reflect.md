---
'@backstage/catalog-model': minor
---

**BREAKING**: Removed `TemplateEntityV1beta2` from the model and moved it to
`@backstage/plugin-scaffolder-common` where `TemplateEntityV1beta3` already
lived. It has also been marked as deprecated in the process - please consider
[migrating to `v1beta3` templates](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3).
