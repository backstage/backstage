---
'@backstage/frontend-plugin-api': patch
---

Added `createFrontendModule` as a replacement for `createExtensionOverrides`, which is now deprecated.

Deprecated the `BackstagePlugin` and `FrontendFeature` type in favor of `FrontendPlugin` and `FrontendFeature` from `@backstage/frontend-app-api` respectively.
