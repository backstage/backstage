---
'@backstage/create-app': patch
---

removed inline and internal CSS from index.html

To make this change to an existing app, apply the following changes to the `packages/app/public/index.html` file:

Remove internal style

```diff
- <style>
-  #root {
-    min-height: 100%;
-  }
- </style>
```

Remove inline style from the body tag

```diff
- <body style="margin: 0">
+ <body>
```
