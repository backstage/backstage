---
'@backstage/create-app': patch
---

Removed `@octokit/rest` and `@gitbeaker/node` from backend dependencies as these are unused in the default app.

To apply these changes to your existing app, remove the following lines from the `dependencies` section of `packages/backend/package.json`

```diff
     "@backstage/plugin-techdocs-backend": "^1.0.0",
-    "@gitbeaker/node": "^34.6.0",
-    "@octokit/rest": "^18.5.3",
```
