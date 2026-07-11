---
'@backstage/plugin-catalog-backend-module-github': patch
---

The GitHub multi-org entity provider now logs a clear warning and skips an organization when no GitHub App installation is found for it, instead of failing the entire ingestion with a confusing rate limit or authentication error. This makes it easier to diagnose missing GitHub App installations, for example when the configured credentials belong to a user who is not an Organization Owner.
