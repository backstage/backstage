---
'@backstage/plugin-events-backend-module-azure': patch
---

Added HTTP POST webhook ingress endpoint for Azure DevOps events, matching the pattern established by the GitHub events module. The ingress endpoint is only registered when `events.modules.azureDevOps.webhookSecret` is configured; without it, no route is exposed. Incoming requests are validated against the `x-ado-webhook-secret` custom header using timing-safe comparison.
