---
'@backstage/plugin-catalog-backend-module-github': patch
---

`GithubMultiOrgEntityProvider` now emits a debug-level log when a GitHub App installation is not found for an organization during a read. The message points to the GitHub Apps troubleshooting docs, making it easier to diagnose cases where the app is not installed on the org or where the authenticated user lacks the Organization Owner role required to see the installation.
