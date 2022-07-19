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

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const todoReader = TodoScmReader.fromConfig(env.config, {
    logger: env.logger,
    reader: env.reader,
  });

  const catalogClient = new CatalogClient({
    discoveryApi: discovery,
  });

  const todoService = new TodoReaderService({
    todoReader,
    catalogClient,
  });

  return await createRouter({ todoService });
}
```

And then add to `packages/backend/src/index.ts`:

```js
// In packages/backend/src/index.ts
import todo from './plugins/todo';
// ...
async function main() {
  // ...
  const todoEnv = useHotMemoize(module, () => createEnv('todo'));
  // ...
  apiRouter.use('/todo', await todo(todoEnv));
```

## Scanned Files

The included `TodoReaderService` and `TodoScmReader` works by getting the entity source location from the catalog.

The location source code is determined automatically. In case of the source code of the component is not in the same place of the entity YAML file, you can explicitly set the value of the [`backstage.io/source-location`](https://backstage.io/docs/features/software-catalog/well-known-annotations#backstageiosource-location) annotation of the entity, and if that is missing it falls back to the [`backstage.io/managed-by-location `](https://backstage.io/docs/features/software-catalog/well-known-annotations#backstageiomanaged-by-location) annotation. Only `url` locations are currently supported, meaning locally configured `file` locations won't work. Also note that dot-files and folders are ignored.

## Parser Configuration

The `TodoScmReader` accepts a `TodoParser` option, which can be used to configure your own parser. The default one is based on [Leasot](https://github.com/pgilad/leasot) and supports a wide range of languages. You can add to the list of supported tags by configuring your own version of the built-in parser, for example:

```ts
import {
  TodoScmReader,
  createTodoParser,
} from '@backstage/plugin-todo-backend';

// ...

const todoReader = TodoScmReader.fromConfig(env.config, {
  logger: env.logger,
  reader: env.reader,
  parser: createTodoParser({
    additionalTags: ['NOTE', 'XXX'],
  }),
});
```
