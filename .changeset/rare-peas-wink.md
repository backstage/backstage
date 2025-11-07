---
'@backstage/plugin-catalog-graph': minor
---

The `catalog-graph` now optionally uses the `catalog-backend-module-graph` if it is installed. The frontend will then make 1 call to the backend to construct the entire graph, instead of recursively querying entities from the frontend. This is a significant optimization for high latency scenarios, such as users being far away from the backend.

Configuration of the `catalog-graph` (and `catalog-backend-module-graph`) is now done in `app-config.yaml`.

`<EntityRelationsGraph>` now supports a custom entity set as a prop which will be used to construct the graph, instead of fetching entities from the backend. This is useful when you already have a set of entities to create a graph from. This can reflect a graph that would otherwise not be possible/feasible to display, e.g. a slice of the graph (a _connected subgraph_) without all other neighbouring nodes.

Performance improvements:

Combined with changes to the `DependencyGraph`, the catalog graph is now very fast and smooth, without any flickering or shaking of the graph when updated.

Two graph operations were _O_(n²) and is now _O_(n log(n)).

The state management (of the url search parameters) has been updated to result in a minimal amount of downstream hook updates and renderings.
