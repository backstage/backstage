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
