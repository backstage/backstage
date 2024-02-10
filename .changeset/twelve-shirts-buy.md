---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-node': patch
---

Add support for `onProcessingError` handler at the catalog plugin (new backend system).

You can use `setOnProcessingErrorHandler` at the `catalogProcessingExtensionPoint`
as replacement for

```ts
catalogBuilder.subscribe({
  onProcessingError: hander,
});
```
