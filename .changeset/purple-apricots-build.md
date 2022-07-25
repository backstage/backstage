---
'@backstage/backend-common': patch
---

The config prop `ensureExists` now applies to schema creation when `pluginDivisionMode` is set to `schema`. This means schemas will no longer accidentally be automatically created when `ensureExists` is set to `false`.
