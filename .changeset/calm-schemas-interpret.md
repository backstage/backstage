---
'@backstage/catalog-model': minor
---

Entity schema validation now uses a JSON Schema engine that doesn't generate code at runtime by default, so frontend code that uses validators from this package no longer needs `'unsafe-eval'` in your Content Security Policy. Validation error messages are worded differently than before.

Backends that validate many entities can switch the whole process to the faster ajv engine, which is what the catalog and scaffolder backends do:

```ts
import { installAjvSchemaEngine } from '@backstage/catalog-model/ajv';

installAjvSchemaEngine();
```
