---
'@backstage/frontend-plugin-api': patch
---

Refactored the internal `createSchemaFromZod` helper to use a schema-first generic pattern, replacing the `ZodSchema<TOutput, ZodTypeDef, TInput>` constraint with `TSchema extends ZodType`. This avoids "excessively deep" type inference errors when multiple Zod copies are resolved.
