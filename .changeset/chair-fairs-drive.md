---
'@backstage/frontend-plugin-api': minor
---

Removed deprecated `namespace` option from `createExtension` and `createExtensionBlueprint`, including `.make` and `.makeWithOverides`, it's no longer necessary and will use the `pluginId` instead.

Removed deprecated `createExtensionOverrides` this should be replaced with `createFrontendModule` instead.

Removed deprecated `BackstagePlugin` type, use `FrontendPlugin` type instead from this same package.
