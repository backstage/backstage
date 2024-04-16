# @backstage/plugin-todo

This plugin lists `// TODO` comments in source code. It currently exports a single component extension for use on entity pages.

## Setup

1. Run:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-todo
yarn --cwd packages/backend add @backstage/plugin-todo-backend
```

2. Add the plugin backend:

In a new file named `todo.ts` under `backend/src/plugins`:

```js
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
    discoveryApi: env.discovery,
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

3. Add the plugin as a tab to your service entities:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { EntityTodoContent } from '@backstage/plugin-todo';

const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route path="/todo" title="Todo">
      <EntityTodoContent />
    </EntityLayout.Route>
```

## Format

The default parser uses [Leasot](https://github.com/pgilad/leasot), which supports a wide range of languages. By default it supports the `TODO` and `FIXME` tags, along with `@` prefix and author reference through with either a `(<name>)` suffix or trailing `/<name>`. For more information on how to configure the parser, see `@backstage/plugin-todo-backend`.

Below are some examples of formats that are supported by default:

```ts
// TODO: Ideally this would be working

// TODO(Rugvip): Not sure why this works, investigate

// @todo: This worked last Monday /Rugvip

// FIXME Nobody knows why this is here
```

Note that trailing comments are not supported, the following TODO would not be listed:

```ts
function reverse(str: string) {
  return str.reverse(); // TODO: optimize
}
```

The scanner also ignores all dot-files and directories, meaning TODOs inside of those will not be listed.

## Extensions

| name                | description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| `EntityTodoContent` | Content for an entity page, showing a table of TODO items for the given entity. |
