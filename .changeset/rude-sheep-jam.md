---
'@backstage/plugin-azure-devops': minor
---

**BREAKING** The `AzureDevOpsClient` no longer requires `identityAPi` but now requires `fetchApi`.

Updated to use `fetchApi` as per [ADR013](https://backstage.io/docs/architecture-decisions/adrs-adr013)
