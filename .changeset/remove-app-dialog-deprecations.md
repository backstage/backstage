---
'@backstage/plugin-app': minor
---

The deprecated `DialogApi.show` and `DialogApi.showModal` methods now throw errors. Use `DialogApi.open` and provide your own dialog surface and dismissal handling.

Added support for the new icons API while preserving `IconsApi.getIcon` for older plugins.
