---
'@backstage/frontend-app-api': patch
---

The default `ComponentsApi` implementation now uses the `ComponentRef` ID as the component key, rather than the reference instance. This fixes a bug where duplicate installations of `@backstage/frontend-plugin-api` would break the app.
