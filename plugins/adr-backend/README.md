# ADR Backend

This ADR backend plugin is primarily responsible for the following:

- Provides a `DefaultAdrCollatorFactory`, which can be used in the search backend to index ADR documents associated with entities to your Backstage Search.

## Indexing ADR documents for search

Before you are able to start indexing ADR documents to search, you need to go through the [search getting started guide](https://backstage.io/docs/features/search/getting-started).

When you have your `packages/backend/src/plugins/search.ts` file ready to make modifications, install this plugin and add the following code snippet to add the `DefaultAdrCollatorFactory`. Also make sure to set up the frontend [ADR plugin](../adr/README.md) so search results can be routed correctly.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-adr-backend
```

```ts
import { DefaultAdrCollatorFactory } from '@backstage/plugin-adr-backend';

...

indexBuilder.addCollator({
  schedule,
  factory: DefaultAdrCollatorFactory.fromConfig({
    cache: env.cache,
    config: env.config,
    discovery: env.discovery,
    logger: env.logger,
    reader: env.reader,
    tokenManager: env.tokenManager,
  }),
});
```

### Parsing custom ADR document formats

By default, the `DefaultAdrCollatorFactory` will parse and index documents that follow the [MADR](https://adr.github.io/madr/) standard file name and template format. If you use a different ADR format and file name convention, you can configure `DefaultAdrCollatorFactory` with custom `adrFilePathFilterFn` and `parser` options (see type definitions for details):

```ts
DefaultAdrCollatorFactory.fromConfig({
  ...
  parser: myCustomAdrParser,
  adrFilePathFilterFn: myCustomAdrFilePathFilter,
  ...
})
```
