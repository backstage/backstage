---
'@backstage/plugin-scaffolder': minor
---

**BREAKING ALPHA**: Extract out schema rendering components into their own Component. This means that the translation keys have changed for `actionsPage.content.tableCell.*`. They have moved to their own root key `renderSchema.*` instead.

```diff
...
-        tableCell: {
-          name: 'Name',
-          title: 'Title',
-          description: 'Description',
-          type: 'Type',
-        },
-        noRowsDescription: 'No schema defined',
...
+    renderSchema: {
+      tableCell: {
+        name: 'Name',
+        title: 'Title',
+        description: 'Description',
+        type: 'Type',
+      },
+      undefined: 'No schema defined',
+    },
```
