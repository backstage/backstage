---
'@backstage/plugin-catalog-backend': major
---

**BREAKING**: Relations, as returned through the `relations` field of entities in the catalog REST API responses, no longer have the `target` property. This property has been removed from the type system since #9972 in March 2022, but was kept around in the response shape until now for backwards compatibility reasons. Please use the `targetRef` field which is a full standard entity ref, instead of `target`.
