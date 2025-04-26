---
'@backstage/plugin-events-backend-module-github': minor
---

**BREAKING**: Removed the `createGithubSignatureValidator` export.

Added support webhook validation based on `integrations.github.[].apps.[].webhookSecret`.
