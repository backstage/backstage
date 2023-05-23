---
'@backstage/plugin-github-actions': minor
---

Added support GitHub Enterprise hosted repositories.

**BREAKING**: The `GithubActionsClient` is updated to take an `scmAuthApi` instead of the previous `githubAuthApi`. This does not require any code changes unless you construct your own `GithubActionsClient`
