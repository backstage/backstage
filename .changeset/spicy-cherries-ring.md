---
'@backstage/plugin-catalog-backend': minor
---

Updated all processors to implement `getProcessorName`.

**BREAKING**: The `CatalogProcessor` interface now require that the `CatalogProcessor` class implements `getProcessorName()`.
The processor name has previously defaulted processor class name. It's therefore _recommended_ to keep your return the same name as the class name if you did not implement this method previously.

For example:

```ts
class CustomProcessor implements CatalogProcessor {
  getProcessorName() {
    // Use the same name as the class name if this method was not previously implemented.
    return 'CustomProcessor';
  }
}
```
