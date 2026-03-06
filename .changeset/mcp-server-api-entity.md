---
'@backstage/catalog-model': minor
---

Added support for `mcp-server` as a new API entity type. MCP server entities use a structured `remotes` array instead of a `definition` string. The `spec.definition` field on `ApiEntityV1alpha1` is now optional, with the JSON schema conditionally requiring either `definition` or `remotes` based on `spec.type`.

Adopters that access `entity.spec.definition` on a typed `ApiEntity` or `ApiEntityV1alpha1` will need to handle the field being `undefined`, for example by adding a `?? ''` fallback or a null check.
