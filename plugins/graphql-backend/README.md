# GraphQL Backend

## Getting Started

This is the GraphQL Backend plugin.

It is responsible for merging different `graphql-plugins` together to provide the end schema.

To run it within the backend do:

1. Register the router in `packages/backend/src/index.ts`:

```ts
const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));

const service = createServiceBuilder(module)
  .loadConfig(configReader)
  /** several different routers */
  .addRouter('/graphql', await graphql(graphqlEnv));
```

2. Start the backend

```bash
yarn workspace example-backend start
```

This will launch the full example backend.
