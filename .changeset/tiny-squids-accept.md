---
'@backstage/plugin-search-backend-module-techdocs': patch
---

**BREAKING:** Moved `schedule` & `collators` settings from module options into app-config for the new backend system. You can now pass in a `TaskScheduleDefinitionConfig` through the `search.collators.techdocs.schedule` configuration key & configure the `TechDocsCollatorFactory` with the key `search.collators.techdocs`.
