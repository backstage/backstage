---
'@backstage/catalog-model': minor
---

**BREAKING**:

- Removed the previously deprecated type `EntityRef`. Please use `string` for stringified entity refs, `CompoundEntityRef` for compound kind-namespace-name triplet objects, or custom objects like `{ kind?: string; namespace?: string; name: string }` and similar if you have need for partial types.
- Removed the previously deprecated type `LocationSpec` type, which has been moved to `@backstage/plugin-catalog-backend`.
- Removed the previously deprecated function `parseEntityName`. Please use `parseEntityRef` instead.
