---
'@backstage/plugin-scaffolder-backend': minor
---

Renamed the export `scaffolderCatalogModule` to `catalogModuleTemplateKind` in order to follow the new recommended naming patterns of backend system items. This is technically a breaking change but in an alpha export, so take care to change your imports if you have already migrated to the new backend system.
