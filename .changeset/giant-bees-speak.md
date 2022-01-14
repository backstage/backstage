---
'@backstage/plugin-techdocs-backend': minor
---

**BREAKING**: The `cache` option is now required by `createRouter`.

Added catalog-based authorization to TechDocs backend. When permissions are enabled for Backstage (via the `permission.enabled` config) the current user must have read access to the doc's corresponding catalog entity. The backend will return a 404 if the current user doesn't have access or if the entity doesn't exist. Entities are cached to for a short time to optimize the `/static/docs` request path, which can be called many times when loading a single TechDocs page.

Note: If you publish your TechDocs documentation to storage in a custom way under paths that do not conform to the default `:namespace/:kind/:name` pattern, then TechDocs will not work with permissions enabled. We want understand these use cases better and provide a solution in the future, so reach out to us on Discord in the [#docs-like-code](https://discord.com/channels/687207715902193673/714754240933003266) channel if you would like to help out.
