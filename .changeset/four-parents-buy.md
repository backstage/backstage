---
'@backstage/frontend-app-api': minor
---

**BREAKING**: The `createSpecializedApp` function now creates a bare-bones app without any of the default app structure or APIs. To re-introduce this functionality if you need to use `createSpecializedApp` you can install the `app` plugin from `@backstage/plugin-app`.

In addition, the `createApp` and `CreateAppFeatureLoader` exports are now deprecated as they are being moved to `@backstage/frontend-defaults`, which should be used instead.
