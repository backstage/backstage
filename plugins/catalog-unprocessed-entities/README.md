# Catalog Unprocessed Entities

## Features

Frontend plugin to view unprocessed entities.

### Failed Entities

You can see entities that are in a failed state:

![Example of failed entities tab](./docs/catalog-unprocessed-entities-failed.png)

### Pending Entities

You can see entities that are in a pending state:

![Example of pending entities tab](./docs/catalog-unprocessed-entities-pending.png)

### Raw View

In either of the failed or pending tabs you have the option to see the raw entity as JSON:

![Example of raw entity](./docs/catalog-unprocessed-entities-raw.png)

## Requirements

Requires the `@backstage/plugin-catalog-backend-module-unprocessed` module to be installed.

## Installation

Import into your App.tsx and include into the `<FlatRoutes>` component:

```tsx
import { CatalogUnprocessedEntitiesPage } from '@backstage/plugin-catalog-unprocessed-entities';
//...

<Route
  path="/catalog-unprocessed-entities"
  element={<CatalogUnprocessedEntitiesPage />}
/>;
```

## Customization

If you want to use the provided endpoints in a different way, you can use the ApiRef doing the following:

```typescript
import { catalogUnprocessedEntitiesApiRef } from '@backstage/plugin-catalog-unprocessed-entities';
import { useApi } from '@backstage/core-plugin-api';

const catalogUnprocessedEntitiesApi = useApi(catalogUnprocessedEntitiesApiRef);
```

Note that you will need to add the API implementation to avoid your instance to crash due to "missing implementation for apiRef". To do so, add the following lines:

```typescript
// In packages/app/src/apis.ts
import { catalogUnprocessedEntitiesPlugin } from '@backstage/plugin-catalog-unprocessed-entities';

export const apis: AnyApiFactory[] = [
  // ...other API implementations

  ...catalogUnprocessedEntitiesPlugin.getApis(),
];
```

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/catalog-unprocessed-entities](http://localhost:3000/catalog-unprocessed-entities).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
