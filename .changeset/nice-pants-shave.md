---
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': patch
'@backstage/plugin-scaffolder-backend-module-sentry': patch
'@backstage/plugin-scaffolder-backend-module-gitea': patch
'@backstage/plugin-notifications-node': patch
---

Use `node-fetch` instead of native fetch, as per https://backstage.io/docs/architecture-decisions/adrs-adr013
