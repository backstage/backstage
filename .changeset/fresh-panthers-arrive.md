---
'@backstage/create-app': patch
---

Tweaked the `.dockerignore` file so that it's easier to add additional backend packages if desired.

To apply this change to an existing app, make the following change to `.dockerignore`:

```diff
 cypress
 microsite
 node_modules
-packages
-!packages/backend/dist
+packages/*/src
+packages/*/node_modules
 plugins
```
