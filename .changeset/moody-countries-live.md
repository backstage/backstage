---
'@backstage/plugin-events-backend-module-azure': minor
---

Adds a new module `azure` to plugin-events-backend.

The module adds a new event router `AzureDevOpsEventRouter`.

The event router will re-publish events received at topic `azureDevOps`
under a more specific topic depending on their `$.eventType` value
(e.g., `azureDevOps.git.push`).

Please find more information at
https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-azure/README.md.
