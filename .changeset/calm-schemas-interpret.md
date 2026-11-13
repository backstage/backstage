---
'@backstage/catalog-model': minor
---

Entity schema validation no longer generates code at runtime, so frontend code that uses validators from this package no longer needs `'unsafe-eval'` in your Content Security Policy. Validation error messages are worded differently than before, and importing the package no longer does any upfront validation work.

Backends that validate many entities can use the new `@backstage/catalog-model/ajv` entry point, which returns the same validators backed by the faster ajv engine. The catalog backend uses these for the built-in kinds. If you have a catalog processor for your own kinds, switch to them to keep the previous performance:

```ts
import { createAjvEntityValidators } from '@backstage/catalog-model/ajv';

const validator =
  createAjvEntityValidators().entityKindSchemaValidator(mySchema);
```

**BREAKING ALPHA**: Catalog model layers created with `createCatalogModelLayer` now run their builder on first use rather than when created, so errors in a layer definition are reported when the catalog model is compiled.
