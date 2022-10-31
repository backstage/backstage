---
'@backstage/plugin-tech-insights': patch
---

Fixed bug when sending data by Post in `runChecks` and `runBulkChecks` functions of the `TechInsightsClient` class, the default `Content-Type` used was `plain/text`
