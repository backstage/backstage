---
'@backstage/plugin-catalog-backend-module-github': patch
---

Handle GitHub `organization`, `team` and `membership` events at the `GithubOrgEntityProvider` by subscribing to the respective topics

Implements `EventSubscriber` to receive events for the topics `github.organization`, `github.team` and `github.membership`.

On `organization`, `team` and `membership` events, the affected User or Group will be refreshed.
This includes adding new entities, refreshing existing ones, and removing obsolete ones.

Please find more information at
https://backstage.io/docs/integrations/github/org#installation-with-events-support
