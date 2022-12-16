---
'@backstage/create-app': patch
---

Removed the `react-router` dependency from the app package, using only `react-router-dom` instead.

This change is just a bit of cleanup and is optional. If you want to apply it to your app, remove the `react-router` dependency from `packages/app/package.json`, and replace any imports from `react-router` with `react-router-dom` instead.
