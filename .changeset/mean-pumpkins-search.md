---
'@backstage/plugin-todo-backend': patch
---

Add support to exclude certain folders in `todo` plugin.

To add excluded folders, edit `app-config.yaml` as follow:

```
todo:
  excludeFolders: ['vendor/']
```
