---
'@backstage/plugin-events-backend-module-bitbucket-cloud': minor
---

Adds a new module `bitbucket-cloud` to plugin-events-backend.

The module adds a new event router `BitbucketCloudEventRouter`.

The event router will re-publish events received at topic `bitbucketCloud`
under a more specific topic depending on their `x-event-key` value
(e.g., `bitbucketCloud.repo:push`).

Please find more information at
https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-bitbucket-cloud/README.md.
