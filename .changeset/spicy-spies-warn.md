---
'@backstage/plugin-scaffolder-common': minor
---

Expose scaffolder permissions in new sub-aggregations.

In addition to exporting a list of all scaffolder permissions in `scaffolderPermissions`, scaffolder-common now exports `scaffolderTemplatePermissions` and `scaffolderActionPermissions`, which contain subsets of the scaffolder permissions separated by resource type.
