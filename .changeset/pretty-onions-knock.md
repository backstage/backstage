---
'@backstage/plugin-azure-devops-backend': patch
'@backstage/plugin-azure-devops-common': patch
'@backstage/plugin-azure-devops': patch
---

Introduced new `AzureDevOpsAnnotatorProcessor` that adds the needed annotations automatically. Also, moved constants to common package so they can be shared more easily
