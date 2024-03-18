---
'@backstage/plugin-azure-devops-backend': patch
'@backstage/plugin-azure-devops': patch
---

`getAllTeams` now accepts an optional `topTeams` parameter which can be used to return more than the default top 100 teams from the Azure DevOps API
