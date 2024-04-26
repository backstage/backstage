# Playlist Backend

Welcome to the playlist backend plugin!

## Installation

### Install the package

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-playlist-backend
```

### Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can do this by creating a file called `packages/backend/src/plugins/playlist.ts`

```tsx
import { createRouter } from '@backstage/plugin-playlist-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    database: env.database,
    discovery: env.discovery,
    identity: env.identity,
    logger: env.logger,
    permissions: env.permissions,
  });
}
```

With the `playlist.ts` router setup in place, add the router to `packages/backend/src/index.ts`:

```diff
+import playlist from './plugins/playlist';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+  const playlistEnv = useHotMemoize(module, () => createEnv('playlist'));

  const apiRouter = Router();
+  apiRouter.use('/playlist', await playlist(playlistEnv));
  ...
  apiRouter.use(notFoundHandler());

```

## Setting up plugin permissions

You configure permissions for specific playlist actions by importing the supported set of permissions from the [playlist-common](../playlist-common/README.md) package along with the custom rules/conditions provided here to incorporate into your [permission policy](https://backstage.io/docs/permissions/writing-a-policy).

This package also exports a `DefaultPlaylistPermissionPolicy` which contains a recommended default permissions policy you can apply as a "sub-policy" in your app:

```diff
# packages/backend/src/plugins/permission.ts

+import { DefaultPlaylistPermissionPolicy, isPlaylistPermission } from '@backstage/plugin-playlist-backend';
...
class BackstagePermissionPolicy implements PermissionPolicy {
+  private playlistPermissionPolicy = new DefaultPlaylistPermissionPolicy();

  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
+    if (isPlaylistPermission(request.permission)) {
+      return this.playlistPermissionPolicy.handle(request, user);
+    }
    ...
  }
}

export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new BackstagePermissionPolicy(),
    ...
```

### New Backend System

The Playlist backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-playlist-backend'));
// ... other feature additions

backend.start();
```
