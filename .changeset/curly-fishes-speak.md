---
'@backstage/create-app': patch
---

(fix) Adds locationAnalyzer to default-app template

The locationAnalyzer was missing from the default-app template.
This resulted in 404 errors for newly bootstraped backstage applications, when adding components without configuration.

To fix this in an existing backstage application, the locationAnalyzer needs to be added to the `packages/backend/src/plugins/catalog.ts` file.
Check out `/backstage/packages/create-app/templates/default-app/packages/backend/src/plugins/catalog.ts` for reference.
