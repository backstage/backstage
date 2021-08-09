---
'@backstage/create-app': patch
---

Updated the index page redirect to work with apps served on a different base path than `/`.

To apply this change to an existing app, remove the `/` prefix from the target route in the `Navigate` element in `packages/app/src/App.tsx`:

```diff
-<Navigate key="/" to="/catalog" />
+<Navigate key="/" to="catalog" />
```
