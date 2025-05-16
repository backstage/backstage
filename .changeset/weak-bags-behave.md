---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-scaffolder-react': minor
'@backstage/plugin-scaffolder-node': minor
'@backstage/plugin-scaffolder': minor
---

BREAKING :

- Converted `scaffolder.task.read` and `scaffolder.task.cancel` into Resource Permissions.
- Added a new scaffolder rule `isTaskOwner` for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as restricting access to tasks and task events based on task creators.
