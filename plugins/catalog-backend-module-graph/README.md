# @backstage/plugin-catalog-backend-module-graph

This catalog-backend module adds support for querying the graph of entities. If installed, it can be used by the catalog-graph plugin for more performant queries than iteratively fetching entities from the frontend. See [Configuration](#configuration) below.

The module adds a route `/graph/by-query` (under the `/api/catalog`) with query parameters on the corresponding schema:

```ts
interface QueryParams {
  rootEntityRefs: string[];
  maxDepth?: number;
  relations?: string[];
  fields?: string[];
  filter?: EntityFilterQuery;
}
```

The root entity ref(s) define the starting point(s) for traversing the graph. If none is provided, the returned list of entities will be empty.

The other query parameters are optional, and will default to no depth limit and include _any_ relation or _any_ kind.

The response payload is an object:

```ts
interface ResponsePayload {
  entities: Entity[];
  cutoff: boolean;
}
```

`entities` is the list of entities in the graph.

`cutoff` will be `true` if `limitEntities` (see below) was reached, hence the graph might be incomplete.

## Installation

```shell
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-graph
```

In `packages/backend/src/index.ts` add the module:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend-module-graph'));
```

## Configuration

The module has two configuration options, `maxDepth` and `limitEntities`.

Example:

```yaml title="app-config.yaml"
catalog:
  graph:
    maxDepth: 5
    limitEntities: 2000
```

`maxDepth` sets the maximum depth of the graph, which the query parameter will be limited to.

`limitEntities` sets the maximum entities to return. The graph traversal will stop after this point.

To enable the frontend `catalog-graph` plugin to use this module, configure it as:

```yaml title="app-config.yaml"
catalogGraph:
  fetchMode: backend
```
