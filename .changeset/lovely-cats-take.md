---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
---

Support Bitbucket Cloud's `repo:updated` events at `BitbucketCloudEntityProvider`.

To make use of the new event type, you have to configure your webhook or add a new ones
that delivers this event type to Backstage similar to `repo:push` before.

Only `repo:updated` events that modify a repository's URL (e.g., due to a name change)
will cause changes (removing the "old", adding the "new" repository).
