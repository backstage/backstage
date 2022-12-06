---
'@backstage/plugin-catalog-backend': minor
---

The catalog no longer stops after the first processor `validateEntityKind`
method returns `true` when validating entity kind shapes. Instead, it continues
through all registered processors that have this method, and requires that _at
least one_ of them returned true.

The old behavior of stopping early made it harder to extend existing core kinds
with additional fields, since the `BuiltinKindsEntityProcessor` is always
present at the top of the processing chain and ensures that your additional
validation code would never be run.

This is technically a breaking change, although it should not affect anybody
under normal circumstances, except if you had problematic validation code that
you were unaware that it was not being run. That code may now start to exhibit
those problems.

If you need to disable this new behavior, `CatalogBuilder` as used in your
`packages/backend/src/plugins/catalog.ts` file now has a
`useLegacySingleProcessorValidation()` method to go back to the old behavior.

```diff
 const builder = await CatalogBuilder.create(env);
+builder.useLegacySingleProcessorValidation();
```
