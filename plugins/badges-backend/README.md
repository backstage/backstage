# Badges Backend

Backend plugin for serving badges to the `@backstage/plugin-badges` plugin.
Default implementation uses
[badge-maker](https://www.npmjs.com/package/badge-maker) for creating the
badges, in SVG.

Currently, only entity badges are implemented. i.e. badges that may have entity
specific information in them, and as such, are served from an entity specific
endpoint.

## Installation

Install the `@backstage/plugin-badges-backend` package in your backend package,
and then integrate the plugin using the following default setup for
`src/plugins/badges.ts`:

```ts
import {
  createRouter,
  createDefaultBadgeFactories,
} from '@backstage/plugin-badges-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  config,
  discovery,
}: PluginEnvironment) {
  return await createRouter({
    config,
    discovery,
    badgeFactories: createDefaultBadgeFactories(),
  });
}
```

The `createDefaultBadgeFactories()` returns an object with badge factories to
the badges-backend `createRouter()` to forward to the default badge builder. To
customize the available badges, provide a custom set of badge factories. See
further down for an example of a custom badge factories function.

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

## API

The badges backend api exposes two main endpoints for entity badges. The
`/badges` prefix is arbitrary, and the default for the example backend.

- `/badges/entity/:namespace/:kind/:name/badge-specs` List all defined badges
  for a particular entity, in json format. See
  [BadgeSpec](https://github.com/backstage/backstage/tree/master/plugins/badges/src/api/types.ts)
  from the frontend plugin for a type declaration.

- `/badges/entity/:namespace/:kind/:name/badge/:badgeId` Get the entity badge as
  an SVG image. If the `accept` request header prefers `application/json` the
  badge spec as JSON will be returned instead of the image.

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/badges)
- [The Backstage homepage](https://backstage.io)
