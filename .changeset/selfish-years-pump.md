---
'@backstage/plugin-github-actions': patch
---

Migrate to new composability API, exporting the plugin instance as `githubActionsPlugin`, the entity content as `EntityGitHubActionsContent`, entity conditional as `isGitHubActionsAvailable`, and entity cards as `EntityLatestGitHubActionRunCard`, `EntityLatestGitHubActionsForBranchCard`, and `EntityRecentGitHubActionsRunsCard`.
