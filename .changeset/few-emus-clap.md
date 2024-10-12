---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-scaffolder': minor
---

BREAKING `/alpha`: Added a new scaffolder rule for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as restricting access to tasks and task events to only their owners.

BREAKING `/alpha`: Removed requirement to have both `scaffolder.task.read` and `scaffolder.task.cancel` permissions to cancel tasks.
