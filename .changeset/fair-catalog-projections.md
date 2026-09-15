---
'@backstage/plugin-catalog-backend': patch
---

Reduce event-loop blocking when reading large sets of entities with field selection. Projection and JSON serialization now yield periodically between entities, allowing other requests to make progress without reducing page sizes. Projected responses use the same incremental JSON response writing as full entities, rather than serializing the entire page at once.

Like full-entity responses, projected list responses may now be streamed without a `Content-Length` or automatically generated `ETag` header.
