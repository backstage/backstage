---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Added a new `OverridableFrontendPlugin` type that is used as the return value of `createFrontendPlugin`. This type includes the `withOverrides` and `.getExtension` methods that are helpful when creating plugin overrides, while the base `FrontendPlugin` type no longer includes these methods. This is a breaking change for the `AppTreeApi` and some other places where the `FrontendPlugin` type is still used, but also fixes some cases where the extra plugin methods were causing issues.
