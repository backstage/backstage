---
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-scaffolder-node': minor
---

`ScaffolderApi.listTasks` now accepts `createdBy`, `status`, `templateRef`, `createdAfter`, `createdBefore` and `order` options in addition to the existing ones, and `TaskBroker.list` accepts the matching `templateRef`, `createdAfter` and `createdBefore` filters.
