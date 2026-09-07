---
'@backstage/plugin-catalog-backend-module-github': minor
---

The GitHub multi-org entity provider now logs a clear warning and aborts ingestion when no GitHub App installation is found for an org, instead of failing with a confusing rate-limit or authentication error. This prevents silent deletion of existing catalog entities.
