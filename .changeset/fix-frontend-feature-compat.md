---
'@backstage/frontend-plugin-api': patch
---

Made the `pluginId` property optional in the `FrontendFeature` type, allowing plugins published against older versions of the framework to be used without type errors.
