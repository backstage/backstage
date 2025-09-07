---
'@backstage/core-components': patch
---

Performance improvements:

The DependencyGraph used to have two relatively "slow" update debounces (250ms and 100ms). These have been lowered dramatically to 10ms (i.e. within a rendering frame).

Improved performance of updates to nodes and edges from _O_(n²) to _O_(n log(n)), and fixed edge updates to re-use existing edges, which removes the flickering/shaking of the UI when the graph updates.
