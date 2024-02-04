# Badges Backend

Backend plugin for serving badges to the `@backstage/plugin-badges` plugin.
Default implementation uses
[badge-maker](https://www.npmjs.com/package/badge-maker) for creating the
badges, in SVG.

Currently, only entity badges are implemented. i.e. badges that may have entity
specific information in them, and as such, are served from an entity specific
endpoint.

## Installation

Install the `@backstage/plugin-badges-backend` package in your backend package:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-badges-backend
```

Add the plugin using the following default setup for
`src/plugins/badges.ts`:

```ts
import {
  createRouter,
  createDefaultBadgeFactories,
} from '@backstage/plugin-badges-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    discovery: env.discovery,
    badgeFactories: createDefaultBadgeFactories(),
    tokenManager: env.tokenManager,
    logger: env.logger,
    identity: env.identity,
  });
}
```

The `createDefaultBadgeFactories()` returns an object with badge factories to
the badges-backend `createRouter()` to forward to the default badge builder. To
customize the available badges, provide a custom set of badge factories. See
further down for an example of a custom badge factories function.

Finally, you have to make the following changes in `src/index.ts`:

```ts
// 1. import the plugin
import badges from './plugins/badges';

...

const config = await loadBackendConfig({
  argv: process.argv,
  logger: rootLogger,
});
const createEnv = makeCreateEnv(config);

  ...
  // 2. Create a PluginEnvironment for the Badges plugin
  const badgesEnv = useHotMemoize(module, () => createEnv('badges'));

  ...

  const apiRouter = Router();
  ...
  // 3. Register the badges plugin in the router
  apiRouter.use('/badges', await badges(badgesEnv));
  ...
  apiRouter.use(notFoundHandler());
```

### New Backend System

The Badges backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
+ import { badgesPlugin } from '@backstage/plugin-badges-backend';
  const backend = createBackend();

  // ... other feature additions

+ backend.add(badgesPlugin());

  backend.start();
```

## Badge builder

Badges are created by classes implementing the `BadgeBuilder` type. The default
badge builder uses badge factories to turn a `BadgeContext` into a `Badge` spec
for the `badge-maker` to create the SVG image.

### Default badges

A set of default badge factories are defined in
[badges.ts](https://github.com/backstage/backstage/tree/master/plugins/badges-backend/src/badges.ts)
as examples.

Additional badges may be provided in your application by defining custom badge
factories, and provide them to the badge builder.

### Custom badges

To provide custom badges, create a badge factories function, and use that when
creating the badges backend router.

```ts
import type { Badge, BadgeContext, BadgeFactories } from '@backstage/plugin-badges-backend';
export const createMyCustomBadgeFactories = (): BadgeFactories => ({
    <custom-badge-id>: {
        createBadge: (context: BadgeContext): Badge | null => {
            // ...
            return {
                label: 'my-badge',
                message: 'custom stuff',
                // ...
            };
        },
    },

    // optional: include the default badges
    // ...createDefaultBadgeFactories(),
});
```

### Badge obfuscation

When you enable the obfuscation feature, the badges backend will obfuscate the entity names in the badge link. It's useful when you want your badges to be visible to the public, but you don't want to expose the entity names and also to protect your entity names from being enumerated.

To enable the obfuscation you need to activate the `obfuscation` feature in the `app-config.yaml`:

```yaml
app:
  badges:
    obfuscate: true
```

:warning: **Warning**: The only endpoint to be publicly available is the `/entity/:entityUuid/:badgeId` endpoint. The other endpoints are meant for trusted internal users and should not be publicly exposed.

> Note that you cannot use env vars to set the `obfuscate` value. It must be a boolean value and env vars are always strings.

## API

The badges backend api exposes two main endpoints for entity badges. The
`/badges` prefix is arbitrary, and the default for the example backend.

### If obfuscation is disabled (default or apps.badges.obfuscate: false)

- `/badges/entity/:namespace/:kind/:name/badge-specs` List all defined badges
  for a particular entity, in json format. See
  [BadgeSpec](https://github.com/backstage/backstage/tree/master/plugins/badges/src/api/types.ts)
  from the frontend plugin for a type declaration.

- `/badges/entity/:namespace/:kind/:name/badge/:badgeId` Get the entity badge as
  an SVG image. If the `accept` request header prefers `application/json` the
  badge spec as JSON will be returned instead of the image.

### If obfuscation is enabled (apps.badges.obfuscate: true)

- `/badges/entity/:namespace/:kind/:name/obfuscated` Get the obfuscated `entity url`.

> Note that endpoint have a embedded authMiddleware to authenticate the user requesting this endpoint. _It meant to be called from the frontend plugin._

- `/badges/entity/:entityUuid/:badgeId` Get the entity badge as an SVG image. If
  the `accept` request header prefers `application/json` the badge spec as JSON
  will be returned instead of the image.

- `/badge/entity/:entityUuid/badge-specs` List all defined badges for a
  particular entity, in json format. See
  [BadgeSpec](https://github.com/backstage/backstage/tree/master/plugins/badges/src/api/types.ts)
  from the frontend plugin for a type declaration.

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/badges)
- [The Backstage homepage](https://backstage.io)
