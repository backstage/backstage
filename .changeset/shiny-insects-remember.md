---
'@backstage/plugin-scaffolder-backend': patch
---

Fix bug where there was error log lines written when failing to `JSON.parse` things that were not `JSON` values.
