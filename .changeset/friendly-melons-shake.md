---
'@backstage/backend-dynamic-feature-service': patch
---

Enhance the `CommonJSModuleLoader` to add support for `resolvePackagePath` calls from backend dynamic plugins, with customizable package resolution, and make the `CommonJSModuleLoader` public API.
Fixing this backend dynamic plugin limitation related to `resolvePackagePath` is important for backend dynamic plugins which use the database, since database migration scripts systematically use `resolvePackagePath`.
