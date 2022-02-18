---
'@backstage/plugin-catalog-backend': patch
---

The catalog API now returns entity relations that have three fields: The old
`type` and `target` fields, as well as a new `targetRef` field. The last one is
the stringified form of the second one.

**DEPRECATION**: The `target` field is hereby deprecated, both as seen from the
catalog API as well as from the `@backstage/catalog-model` package. Both
`target` and `targetRef` will be produced for some time, but eventually,
`target` will be removed entirely. Please update your readers to stop consuming
the `relations.[].target` field from the catalog API as soon as possible.
