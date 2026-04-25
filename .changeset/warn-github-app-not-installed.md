---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added a warning log message to `GithubMultiOrgEntityProvider` when a GitHub App is not installed for an organization. This helps users diagnose authentication issues when the provider falls back to token authentication instead of using the GitHub App.
