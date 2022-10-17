---
'@backstage/plugin-catalog-backend-module-github': patch
---

Replaces in-code uses of `GitHub` by `Github` and deprecates old versions.

Deprecates

- `GitHubEntityProvider` replaced by `GithubEntityProvider`
- `GitHubLocationAnalyzer` replaced by `GithubLocationAnalyzer`
- `GitHubLocationAnalyzerOptions` replaced by `GithubLocationAnalyzerOptions`
- `GitHubOrgEntityProvider` replaced by `GithubOrgEntityProvider`
- `GitHubOrgEntityProviderOptions` replaced by `GithubOrgEntityProviderOptions`

Renames

- `GitHubLocationAnalyzer` to `GithubLocationAnalyzer`
- `GitHubLocationAnalyzerOptions` to `GithubLocationAnalyzerOptions`
