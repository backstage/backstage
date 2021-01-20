---
'@backstage/catalog-model': minor
---

The catalog no longer attempts to merge old and new annotations, when updating an entity from a remote location. This was a behavior that was copied from kubernetes, and catered to use cases where you wanted to use HTTP POST to update an entity in-place, outside of what the refresh loop does. This has proved to be a mistake, because as a side effect, the refresh loop effectively is unable to ever delete annotations when they are removed from source YAML. This is obviously a breaking change, but we believe that this is not a behavior that is relied upon in the wild, and it has never been an actually supported use flow of the catalog. We therefore choose to break the behavior outright, and instead just store updated annotations verbatim - just like we already do for example for labels
