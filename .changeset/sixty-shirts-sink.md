---
'@backstage/plugin-catalog-backend': patch
'@backstage/catalog-model': patch
'@backstage/plugin-catalog-node': patch
'@backstage/plugin-catalog': patch
---

Allow entity processors to add status items to an entity.

This change enables entity processors to contribute status items to entities during processing.
Status items can provide valuable insights into the state of an entity, such as validation results or processing outcomes.

To add status items, entity processors can now use the `status` method available in the `processingResult`, like so:

```ts
emit(processingResult.status('This is a status message', 'info'));
```

The `AlphaEntity` export has now been deprecated and the `status` field has been added to the main `Entity` type in
`@backstage/catalog-model`.
