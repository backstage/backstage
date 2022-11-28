# explore-backend

Welcome to the explore-backend backend plugin!

_This plugin was created through the Backstage CLI_

## Getting started

### Install the Package

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-explore-backend
```

### Create a ToolProvider

Create a `ToolProvider` to provide `ExploreTool` objects.

```ts
import {
  GetExploreToolsRequest,
  GetExploreToolsResponse,
} from '@backstage/plugin-explore-common';

export async function getExploreTools(
  request: GetExploreToolsRequest,
): Promise<GetExploreToolsResponse> {
  const { filter } = request ?? {};

  // Get tool data from a file or some other source
  const toolData = getToolData();

  // Populate ExploreTool[] objects & use filter to filter them
  const tools = [...toolData].filter(filterToolPredicate);

  return {
    tools,
  };
}
```

**NOTE: You can see the `plugins/explore-backend/src/example/getExampleTools.ts`
as a simple hardcoded example.**

### Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can
do this by creating a file called `packages/backend/src/plugins/explore.ts`

```ts
import {
  createRouter,
  getExampleTools,
} from '@backstage/plugin-explore-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { getExploreTools } from '../data/explore';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    toolProvider: {
      getTools: getExploreTools,
    },
  });
}
```

With the `explore.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```diff
+import explore from './plugins/explore';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+  const exploreEnv = useHotMemoize(module, () => createEnv('explore'));

  const apiRouter = Router();
+  apiRouter.use('/explore', await explore(exploreEnv));
  ...
  apiRouter.use(notFoundHandler());
```

### Wire up the Frontend

See [the explore plugin README](../explore/README.md) for more information.
