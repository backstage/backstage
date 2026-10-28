---
'@backstage/frontend-plugin-api': minor
---

Removed the deprecated `IconComponent` export and `IconsApi.getIcon` method from the public types. Use `IconElement` and `IconsApi.icon` instead. The legacy `IconComponent` type remains available from `@backstage/core-plugin-api`.

Custom `IconsApi` implementations must retain `getIcon` at runtime for older consumers of `core.icons`. Removing that runtime method requires a new version of the icons API.
