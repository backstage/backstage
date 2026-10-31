---
'@backstage/frontend-plugin-api': minor
---

Removed the deprecated `DialogApi.show`, `DialogApi.showModal`, and `IconsApi.getIcon` methods. Use `DialogApi.open` with your own dialog presentation, and `IconsApi.icon` to retrieve icon elements.

The API references now use `core.dialog.v2` and `core.icons.v2`. Upgrade `@backstage/plugin-app` alongside this package, and update custom API implementations to use the new references.
