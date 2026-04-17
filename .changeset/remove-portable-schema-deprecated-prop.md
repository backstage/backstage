---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the deprecated property form of `PortableSchema.schema`. The `schema` member is now a plain method that must be called as `schema()` — direct property access like `schema.type` or `schema.properties` is no longer supported.
