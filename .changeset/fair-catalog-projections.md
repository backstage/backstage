---
'@backstage/plugin-catalog-backend': patch
---

Improve responsiveness to other requests while reading large sets of entities with field selection, without reducing page sizes.

Like full-entity responses, projected list responses may now be streamed without a `Content-Length` or automatically generated `ETag` header.
