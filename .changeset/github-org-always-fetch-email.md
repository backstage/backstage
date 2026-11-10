---
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-backend-module-github-org': patch
---

Added `fetchEmailForGithubApps` config option to the GitHub org entity providers (`GithubOrgEntityProvider` and `GithubMultiOrgEntityProvider`). When enabled, the provider requests the public email field from the GitHub GraphQL API even when using a GitHub App for authentication. By default, the public email is only requested with personal access tokens due to a historical GitHub API limitation that may no longer apply to all instances. If the GitHub instance does not support this, the user sync will fail — only enable it after confirming your GitHub App can access user emails.
