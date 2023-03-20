---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-events-backend': patch
---

Adds an optional `EventBroker` for sending an event when there are conflicts, and exports `InMemoryBroker` for use in other plugins.
