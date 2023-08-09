---
'@backstage/plugin-search-backend-module-techdocs': minor
---

**BREAKING:** Moved `schedule` & `collators` settings from module options into app-config for the new backend system. You can now pass in a `TaskScheduleDefinitionConfig` through the `search.techdocs.schedule` configuration key & configure the `TechDocsCollatorFactory` with the key `search.techdocs.collators`.
