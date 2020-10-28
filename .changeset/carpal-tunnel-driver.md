---
'@backstage/plugin-catalog-backend': minor
---

- The `CatalogProcessor` API was updated to have `preProcessEntity` and
  `postProcessEntity` methods, instead of just one `processEntity`. This makes
  it easier to make processors that have several stages in one, and to make
  different processors more position independent in the list of processors.
- The `EntityPolicy` is now given directly to the `LocationReaders`, instead of
  being enforced inside a policy. We have decided to separate out the act of
  validating an entity to be outside of the processing flow, to make it
  possible to apply more liberally and to evolve it as a separate concept.
- Because of the above, the `EntityPolicyProcessor` has been removed.
