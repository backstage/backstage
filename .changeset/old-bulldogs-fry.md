---
'@backstage/plugin-catalog-backend-module-github': patch
---

Handle GitHub `push` events at the `GithubEntityProvider` by subscribing to the topic `github.push.`

Implements `EventSubscriber` to receive events for the topic `github.push`.

On `github.push`, the affected repository will be refreshed.
This includes adding new Location entities, refreshing existing ones,
and removing obsolete ones.

Please find more information at
https://backstage.io/docs/integrations/github/discovery#installation-with-events-support
