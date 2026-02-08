---
'@backstage/plugin-catalog-backend': minor
---

Adds experimental entity change events support that emits events to the
'experimental.catalog.changes' topic when catalog entities are created, updated,
or deleted. Enable this feature by setting
'catalog.experimentalEntityChangeEvents: true' in your app-config to allow
external systems to react to catalog changes in real time.
