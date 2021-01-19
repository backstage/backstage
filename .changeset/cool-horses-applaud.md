---
'@backstage/plugin-catalog': patch
---

Derive the list of to-delete entities in the `UnregisterEntityDialog` from the `backstage.io/managed-by-origin-location` annotation.
The dialog also rejects deleting entities that are created by the `bootstrap:bootstrap` location.
