---
'@backstage/create-app': patch
---

Migrated the app template to React 17.

To apply this change to an existing app, make the following change to `packages/app/package.json`:

```diff
     "history": "^5.0.0",
-    "react": "^16.13.1",
-    "react-dom": "^16.13.1",
+    "react": "^17.0.2",
+    "react-dom": "^17.0.2",
     "react-router": "6.0.0-beta.0",
```

Since we have recently moved over all `react` and `react-dom` dependencies to `peerDependencies` of all packages, and included React 17 in the version range, this should be all you need to do. If you end up with duplicate React installations, first make sure that all of your plugins are up-to-date, including ones for example from `@roadiehq`. If that doesn't work, you may need to fall back to adding [Yarn resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) in the `package.json` of your project root:

```diff
+  "resolutions": {
+    "react": "^17.0.2",
+    "react-dom": "^17.0.2"
+  },
```
