# `@backstage/plugin-catalog-backend-module-incremental-ingestion`

The Incremental Ingestion catalog backend module provides an Incremental Entity Provider that can be used to ingest data from sources using delta mutations, while retaining the orphan prevention mechanism provided by full mutations.

It is designed for large data sources (100k+ records) that support pagination but may not fit into memory. Instead of a single full mutation, it performs a series of short "bursts" combined with a mark-and-sweep mechanism to handle deletions efficiently.

## Installation

1. Install the package from the Backstage root directory:

```sh
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-incremental-ingestion
```

2. Add the module to your backend:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

backend.add(
  import('@backstage/plugin-catalog-backend-module-incremental-ingestion'),
);

backend.start();
```

## Documentation

For a full walkthrough on writing and installing an incremental entity provider, including the execution diagram, configuration options, administrative routes, and error handling, see the [Incremental entity providers](https://backstage.io/docs/features/software-catalog/external-integrations/incremental-entity-providers) documentation.
