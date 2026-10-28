---
'@backstage/frontend-plugin-api': minor
---

Removed the deprecated `DialogApi.show`, `DialogApi.showModal`, and `IconsApi.getIcon` methods from the current contracts. The dialog and icons API references now use the IDs `core.dialog.v2` and `core.icons.v2`. Upgrade `@backstage/plugin-app` alongside this package so the new IDs are provided. Custom implementations should implement the current contracts and register them with the current API references.

Use `DialogApi.open` with your own dialog surface, backdrop, and dismissal behavior. Include `undefined` in the result type if dismissing without a result is allowed. Calls to `show` or `showModal` through the original API ID now throw a migration error.

Use `IconsApi.icon` to obtain an icon element instead of a component. The app continues providing `getIcon` through the original icons API ID for older compiled consumers.
