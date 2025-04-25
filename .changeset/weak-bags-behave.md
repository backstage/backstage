---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-scaffolder-react': minor
'@backstage/plugin-scaffolder-node': minor
'@backstage/plugin-scaffolder': minor
---

BREAKING :

- Added a new scaffolder rule `hasTemplateOwners` for `scaffolder.task.read` and `scaffolder.task.cancel` to allow for conditional permission policies such as granting template owners visibility into all runs of their templates.
- Added a new column `template_owner` to the `tasks` table
