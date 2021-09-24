---
'@backstage/plugin-catalog-backend': minor
---

Introduced a new `CatalogProcessorCache` that is available to catalog processors. It allows arbitrary values to be saved that will then be visible during the next run. The cache is scoped to each individual processor and entity, but is shared across processing steps in a single processor.

The cache is available as a new argument to each of the processing steps, except for `validateEntityKind` and `handleError`.

This also introduces an optional `getProcessorName` to the `CatalogProcessor` interface, which is used to provide a stable identifier for the processor. While it is currently optional it will move to be required in the future.

The breaking part of this change is the modification of the `state` field in the `EntityProcessingRequest` and `EntityProcessingResult` types. This is unlikely to have any impact as the `state` field was previously unused, but could require some minor updates.
