---
'@backstage/plugin-catalog-graph': minor
---

Added support for a backend-driven graph mode via the new `catalogGraph.fetchMode` config option. When set to `'backend'` (requires `@backstage/plugin-catalog-backend-module-graph` to be installed), the frontend makes a single call to the backend to construct the entire graph, instead of recursively querying entities from the frontend. This is a significant optimization for high latency scenarios, such as users being far away from the backend. The default is `'frontend'`, which preserves existing behavior.

The Configuration of the `catalog-graph` can now be done via app-config. The following options are available:

- `fetchMode` (`'frontend' | 'backend'`, default `'frontend'`): Controls whether the graph is constructed in the frontend or the backend. See above.
- `maxDepth` (number, default `Infinity`): Hard cap on the depth of the graph. Respected in both frontend and backend modes. Useful for very large catalogs where unbounded traversal is not feasible.
- `limitEntities` (number): Stops graph generation in the backend once this many entities have been fetched, even if `maxDepth` hasn't been reached. Useful to prevent overwhelming the frontend with too much data.
- `knownRelations` (string[]): Overrides the full list of relations shown in the relation type drop-down. Use `additionalKnownRelations` to extend the built-in list instead.
- `additionalKnownRelations` (string[]): Adds extra relations on top of the built-in ones in the drop-down.
- `knownRelationPairs`: Overrides the built-in relation pairs (used to group bidirectional relations). Use `additionalKnownRelationPairs` to extend instead.
- `additionalKnownRelationPairs`: Adds extra relation pairs on top of the built-in ones.
- `defaultRelationTypes`: Sets the relation types selected by default in the UI, unless overridden by component props.

The `<EntityRelationsGraph />` component now supports a custom entity set as a prop which will be used to construct the graph, instead of fetching entities from the backend. This is useful when you already have a set of entities to create a graph from. This can reflect a graph that would otherwise not be possible/feasible to display, e.g. a slice of the graph (a _connected subgraph_) without all other neighbouring nodes.

Performance improvements:

Combined with changes to `<DependencyGraph />`, the catalog graph is now very fast and smooth, without any flickering or shaking of the graph when updated.

Two graph operations were _O_(n²) and is now _O_(n log(n)).

The state management (of the url search parameters) has been updated to result in a minimal amount of downstream hook updates and renderings.
