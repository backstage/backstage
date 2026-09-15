---
'@backstage/plugin-catalog-backend': patch
---

Reduce event-loop blocking when reading large sets of entities with field selection. Projection and JSON serialization now run in batches of at most 100 entities, also bounded by input size, yielding periodically between batches. This allows other requests to make progress without reducing page sizes. Projected responses are written incrementally, rather than serializing the entire page at once. Full-entity reads retain their existing raw JSON fast path.

Like full-entity responses, projected list responses may now be streamed without a `Content-Length` or automatically generated `ETag` header.
