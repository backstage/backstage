---
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-scaffolder-common': patch
'@backstage/plugin-scaffolder': patch
---

Added a new scaffolder rule for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as restricting access to tasks and task events to only their owners.
Added a new `adminTaskReadPermission` (`scaffolder.task.admin.read`) that allow user to read all tasks and task events.
Removed requirement to have both `scaffolder.task.read` and `scaffolder.task.cancel` permissions to cancel tasks.
