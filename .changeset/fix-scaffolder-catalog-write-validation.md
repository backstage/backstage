---
'@backstage/plugin-scaffolder-backend': patch
---

Add strict Zod validation to the `catalog:write` action to ensure generated entities have required fields like `apiVersion`, `kind`, and `metadata.name`.
