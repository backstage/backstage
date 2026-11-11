---
'@backstage/plugin-app': patch
---

Fixed the app remounting during finalization when root elements are added, for example ones deferred with an `if` predicate. Root elements are now keyed by their extension ID and rendered in a single fixed position, so adding one no longer moves the rest of the app in the React tree.
