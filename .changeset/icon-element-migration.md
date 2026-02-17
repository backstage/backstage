---
'@backstage/frontend-plugin-api': minor
'@backstage/frontend-app-api': patch
'@backstage/core-compat-api': patch
'@backstage/plugin-app-react': patch
---

Added `IconElement` type as a replacement for the deprecated `IconComponent`. The `IconsApi` now has a new `icon()` method that returns `IconElement`, while the existing `getIcon()` method is deprecated. The `IconBundleBlueprint` now accepts both `IconComponent` and `IconElement` values.
