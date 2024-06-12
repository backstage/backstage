---
'@backstage/integration': minor
---

**BREAKING** Removed deprecated code from when casing was changed from `GitHub` to `Github` nearly two years ago. The following items have been removed:

- `getGitHubFileFetchUrl` (use `getGithubFileFetchUrl` instead)
- `GitHubIntegrationConfig` (use `GithubIntegrationConfig` instead)
- `GitHubIntegration` (use `GithubIntegration` instead)
- `readGitHubIntegrationConfig` (use `readGithubIntegrationConfig` instead)
- `readGitHubIntegrationConfigs` (use `readGithubIntegrationConfigs` instead)
- `replaceGitHubUrlType` (use `replaceGithubUrlType` instead)
