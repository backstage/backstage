---
'@backstage/plugin-scaffolder-node': patch
---

Removed deprecated `bitbucket` integration from being used in the `parseRepoUrl` function. It will use the `bitbucketCloud` or `bitbucketServer` integrations instead.
