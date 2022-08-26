---
'@backstage/plugin-github-pull-requests-board': patch
---

Add optional `defaultLimit` prop to `EntityTeamPullRequestsCard` and `EntityTeamPullRequestsContent` to limit the number of PRs shown per repository. Excluding this prop will result in showing all PRs for each repository.
