---
'@backstage/plugin-azure-devops-backend': patch
'@backstage/plugin-azure-devops': patch
---

`getAllTeams` now accepts an optional `limit` parameter which can be used to return more than the default limit of 100 teams from the Azure DevOps API
