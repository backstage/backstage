---
'@backstage/plugin-scaffolder-backend': minor
---

Added the possibility to authorize parameters and steps of a template

The scaffolder plugin is now integrated with the permission framework.
It is possible to toggle parameters or actions within templates by marking each section with specific `tags`, inside a `backstage:permissions` property under each parameter or action. Each parameter or action can then be permissioned by using a conditional decision containing the `scaffolderTemplateRules.hasTag` rule.
