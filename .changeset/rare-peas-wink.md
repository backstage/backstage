---
'@backstage/plugin-catalog-graph': minor
---

BREAKING CHANGE:
The `catalog-graph` now requires the `catalog-graph-backend` to be installed. The frontend will now make 1 call to the backend to construct the entire graph, instead of recursively querying entities from the frontend. This is a significant optimization for high latency scenarios, such as users being far away from the backend.

Configuration of the `catalog-graph` (and backend) is now done in `app-config.yaml`.

Performance improvements:

Combined with changes to the `DependencyGraph`, the catalog graph is now very fast and smooth, without any flickering or shaking of the graph when updated.

Two graph operations were _O_(n²) and is now _O_(n log(n)).

The state management (of the url search parameters) has been updated to result in a minimal amount of downstream hook updates and rerenderings.
