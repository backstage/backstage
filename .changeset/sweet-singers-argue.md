---
'@backstage/plugin-catalog-backend-module-github': minor
---

Remove use of `EventBroker` and `EventSubscriber` for the GitHub org data providers.

BREAKING CHANGE:

- `GithubOrgEntityProvider.onEvent` made private
- `GithubOrgEntityProvider.supportsEventTopics` removed
- `eventBroker` option was removed from `GithubMultiOrgEntityProvider.fromConfig`
- `GithubMultiOrgEntityProvider.supportsEventTopics` removed

This change only impacts users who still use the legacy backend system
**and** who still use `eventBroker` as option when creating these
entity providers.

Please pass the `EventsService` instance as option `events` instead.
You can find more information at the [installation documentation](https://backstage.io/docs/integrations/github/org/#legacy-backend-system).
