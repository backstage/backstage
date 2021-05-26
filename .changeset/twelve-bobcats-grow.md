---
'@backstage/catalog-model': minor
---

Breaking changes:

- The long-deprecated `schemaValidator` export is finally removed.

Additions:

- The `EntityEnvelope` type, which is a supertype of `Entity`.
- The `entityEnvelopeSchemaValidator` function, which returns a validator for an `EntityEnvelope` or its subtypes, based on a JSON schema.
- The `entitySchemaValidator` function, which returns a validator for an `Entity` or its subtypes, based on a JSON schema.
- The `entityKindSchemaValidator` function, which returns a specialized validator for custom `Entity` kinds, based on a JSON schema.
