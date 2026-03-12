---
'@backstage/catalog-model': major
---

Added `backstage.io/v1alpha2` API entity schema with support for MCP server entities. MCP server entities on v1alpha2 use a structured `remotes` array instead of a `definition` string.

`ApiEntity` is now a union of `ApiEntityV1alpha1 | ApiEntityV1alpha2`. Consumers should narrow on `apiVersion` before accessing version-specific fields like `spec.definition` or `spec.remotes`.

New exports: `ApiEntityV1alpha2`, `ApiEntityV1alpha2Spec`, `apiEntityV1alpha2Validator`.
