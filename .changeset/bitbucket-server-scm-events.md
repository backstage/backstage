---
'@backstage/plugin-catalog-backend-module-bitbucket-server': minor
---

Added SCM event handling for Bitbucket Server. The new
`BitbucketServerScmEventsBridge` subscribes to the `bitbucketServer` topic
and translates incoming webhook events into catalog SCM events:

- `repo:refs_changed` (branch/tag push) → `repository.updated`
- `repo:modified` (repository renamed) → `repository.moved` or `repository.updated`
- `repo:deleted` → `repository.deleted`

This enables instant catalog refresh when entities change in Bitbucket Server,
consistent with the equivalent implementations for GitHub, GitLab, and
Bitbucket Cloud.
