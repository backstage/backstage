---
'@backstage/plugin-github-actions': patch
---

Migrate to new composability API, exporting the plugin instance as `githubActionsPlugin`, the entity content as `EntityGithubActionsContent`, entity conditional as `isGithubActionsAvailable`, and entity cards as `EntityLatestGithubActionRunCard`, `EntityLatestGithubActionsForBranchCard`, and `EntityRecentGithubActionsRunsCard`.
