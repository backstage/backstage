---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
---

Added Bitbucket Cloud SCM event translation layer for the catalog backend module. The module now subscribes to Bitbucket Cloud webhook events and translates them into generic catalog SCM events, enabling instant catalog reprocessing when repositories are pushed to, renamed, transferred, or deleted. The `analyzeBitbucketCloudWebhookEvent` function is exported from the alpha entry point for custom integrations.
