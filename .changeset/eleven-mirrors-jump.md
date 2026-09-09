---
'@backstage/plugin-catalog-backend-module-gitea': patch
---

Added Gitea SCM event translation layer for the catalog backend module. The module now subscribes to Gitea webhook events and translates them into generic catalog SCM events, enabling instant catalog reprocessing when catalog files are pushed to the default branch, or when repositories are created, renamed, or deleted. The `analyzeGiteaWebhookEvent` function is exported from the alpha entry point for custom integrations.
