---
'@backstage/plugin-catalog-react': patch
---

Fixed `EntityOwnerPicker` crashing with `Entity reference "<name>" had missing or empty kind` when the `owners` query parameter contains humanized entity refs, as produced by the `OwnershipCard` links in `@backstage/plugin-org`.

Query parameters were stored as-is in the initial state and only converted to full entity refs by an effect, which runs after the first render. That first render passed the raw value to the entity presentation API, whose `parseEntityRef` call rejects a ref without a kind. The same raw value was also sent to `catalogApi.getEntitiesByRefs` on mount, and made the option checkboxes render unselected until the effect ran.

The query parameters are now normalized through `EntityOwnerFilter` when the state is initialized, matching what the existing effect already did and what the `filters` code path already produced.
