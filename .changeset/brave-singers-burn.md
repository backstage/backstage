---
'@backstage/plugin-catalog-backend': patch
---

The following processors now properly accept an `ScmIntegrationRegistry` (an
interface) instead of an `ScmIntegrations` (which is a concrete class).

- `AzureDevOpsDiscoveryProcessor`
- `CodeOwnersProcessor`
- `GitLabDiscoveryProcessor`
- `GithubDiscoveryProcessor`
- `GithubMultiOrgReaderProcessor`
- `GithubOrgReaderProcessor`
