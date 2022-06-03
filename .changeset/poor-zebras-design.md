---
'@backstage/plugin-scaffolder-backend': minor
---

- Added an optional `list` method on the `TaskBroker` and `TaskStore` interface to list tasks by an optional `userEntityRef`
- Implemented a `list` method on the `DatabaseTaskStore` class to list tasks by an optional `userEntityRef`
- Added a route under `/v2/tasks` to list tasks by a `userEntityRef` using the `createdBy` query parameter
