---
'@backstage/plugin-github-pull-requests-board': patch
---

Add optional `pullRequestLimit` prop to `EntityTeamPullRequestsCard` and `EntityTeamPullRequestsContent` to limit the number of PRs shown per repository. Excluding this prop will default the number of pull requests shown to 10 per repository (the existing functionality).
