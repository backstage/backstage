---
'@backstage/plugin-search-backend-module-explore': patch
---

Breaking change for the alpha export moved `schedule` from module options into app-config for the new backend system. You can now pass in a `TaskScheduleDefinitionConfig` through the `search.collators.explore.schedule` configuration key.
