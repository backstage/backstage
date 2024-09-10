---
'@backstage/plugin-scaffolder-backend/alpha': minor
'@backstage/plugin-scaffolder-common/alpha': minor
'@backstage/plugin-scaffolder': minor
---

BREAKING: Added a new scaffolder rule for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as restricting access to tasks and task events to only their owners.

BREAKING: Removed requirement to have both `scaffolder.task.read` and `scaffolder.task.cancel` permissions to cancel tasks.
