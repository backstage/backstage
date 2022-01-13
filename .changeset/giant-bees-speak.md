---
'@backstage/plugin-techdocs-backend': minor
---

**BREAKING**: The `cache` option is now required by `createRouter`.

Added catalog-based authorization to TechDocs backend. When permissions are enabled for Backstage (via the `permission.enabled` config) the current user must have read access to the doc's corresponding catalog entity. The backend will return a 404 if the current user doesn't have access.

Note: Custom TechDocs setups that expose docs without a corresponding catalog entity will not work with permissions enabled, but a solution for this will be provided in the future.
