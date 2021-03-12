# @backstage/plugin-todo-backend

Backend for the `@backstage/plugin-todo` plugin. Assists in scanning for and listing `// TODO` comments in source code repositories.

## Installation

Install the `@backstage/plugin-todo-backend` package in your backend packages, and then integrate the plugin using the following default setup for `src/plugins/todo.ts`:

```ts
import { Router } from 'express';
import { CatalogClient } from '@backstage/catalog-client';
import {
  createRouter,
  TodoReaderService,
  TodoScmReader,
} from '@backstage/plugin-todo-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  reader,
  config,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const todoReader = TodoScmReader.fromConfig(config, {
    logger,
    reader,
  });
  const catalogClient = new CatalogClient({ discoveryApi: discovery });
  const todoService = new TodoReaderService({
    todoReader,
    catalogClient,
  });

  return await createRouter({ todoService });
}
```

## Parser Configuration

The `TodoScmReader` accepts a `TodoParser` option, which can be used to configure your own parser. The default one is based on [Leasot](https://github.com/pgilad/leasot) and supports a wide range of languages. You can add to the list of supported tags by configuring your own version of the built-in parser, for example:

```ts
import {
  TodoScmReader,
  createTodoParser,
} from '@backstage/plugin-todo-backend';

// ...

const todoReader = TodoScmReader.fromConfig(config, {
  logger,
  reader,
  parser: createTodoParser({
    additionalTags: ['NOTE', 'XXX'],
  }),
});
```
