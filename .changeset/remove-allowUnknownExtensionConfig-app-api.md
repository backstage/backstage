---
'@backstage/frontend-app-api': minor
---

**BREAKING**: Removed the `allowUnknownExtensionConfig` option from `createSpecializedApp`. Unknown extension configuration is now always reported as an `INVALID_EXTENSION_CONFIG_KEY` error in the returned `errors` array instead.
