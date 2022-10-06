---
'@backstage/backend-common': patch
'@backstage/cli': patch
'@backstage/plugin-airbrake-backend': patch
'@backstage/plugin-badges-backend': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-graphql-backend': patch
'@backstage/plugin-periskop-backend': patch
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-rollbar-backend': patch
'@backstage/plugin-search-backend': patch
'@backstage/plugin-tech-insights-backend': patch
'@backstage/plugin-user-settings-backend': patch
---

Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
