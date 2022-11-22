---
'@backstage/plugin-catalog-backend-module-openapi': patch
---

Enabled support of resolving `$refs` in all kind of yaml documents, not only OpenAPI. This implicitly adds `$ref` resolving support for AsyncAPI specs. Thus, the `openApiPlaceholderResolver` has been renamed to `jsonSchemaRefPlaceholderResolver`.
