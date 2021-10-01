---
'@backstage/plugin-catalog-backend': minor
---

Errors emitted from processors are now considered a failure during entity processing and will prevent entities from being updated. The impact of this change is that when errors are emitted while for example reading a location, then ingestion effectively stops there. If you emit a number of entities along with just one error, then the error will be persisted on the current entity but the emitted entities will _not_ be stored. This fixes [a bug](https://github.com/backstage/backstage/issues/6973) where entities would get marked as orphaned rather than put in an error state when the catalog failed to read a location.

In previous versions of the catalog, an emitted error was treated as a less severe problem than an exception thrown by the processor. We are now ensuring that the behavior is consistent for these two cases. Even though both thrown and emitted errors are treated the same, emitted errors stay around as they allow you to highlight multiple errors related to an entity at once. An emitted error will also only prevent the writing of the processing result, while a thrown error will skip the rest of the processing steps.
