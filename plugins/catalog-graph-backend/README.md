# catalog-graph

This is the backend plugin for the catalog-graph frontend plugin. It is responsible for fetching the graph of entities queried from the frontend.

## Installation

This plugin is installed via the `@backstage/plugin-catalog-graph-backend` package. To install it to your backend package, run the following command:

```bash
# From your root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-graph-backend
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-catalog-graph-backend'));
```

## Configuration

The backend can be configured to limit the maximum graph depth and/or a maximum number of returned entities, using `catalogGraph.maxDepth` and `catalogGraph.limitEntities`.

## Development

This plugin backend can be started in a standalone mode from directly in this
package with `yarn start`. It is a limited setup that is most convenient when
developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn start` from the root directory.
