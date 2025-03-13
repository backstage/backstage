---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-scaffolder-react': minor
'@backstage/plugin-scaffolder-node': minor
'@backstage/plugin-scaffolder': minor
---

BREAKING : Added two new scaffolder rules for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as restricting access to tasks and task events based on creators (`hasCreatedBy`) and granting template owners visibility into all runs of their templates (`hasTemplateEntityRefs`).
