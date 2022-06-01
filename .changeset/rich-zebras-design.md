---
'@backstage/plugin-scaffolder': minor
---

- Added a new page under `/create/tasks` to show tasks that have been run by the Scaffolder.
- Ability to filter these tasks by the signed in user, and all tasks.
- Added optional method to the `ScaffolderApi` interface called `listTasks` to get tasks with an required `filterByOwnership` parameter.
