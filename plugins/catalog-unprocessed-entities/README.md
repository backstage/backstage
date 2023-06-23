# catalog-unprocessed-entities

Frontend plugin to view unprocessed entities.

## Requirements

Requires the `@backstage/plugin-catalog-backend-module-unprocessed` module to be installed.

## Installation

```shell
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-unprocessed
```

Import into your `App.tsx` and include into the `<FlatRoutes>` component:

```tsx title="packages/app/src/App.tsx"
import { CatalogUnprocessedEntitiesPage } from '@backstage/plugin-catalog-unprocessed-entities';
//...

<Route
  path="/catalog-unprocessed-entities"
  element={<CatalogUnprocessedEntitiesPage />}
/>;
```

## Getting started

Your plugin has been added to the example app in this repository,
meaning you'll be able to access it by running `yarn start` in the root directory,
and then navigating to [/catalog-unprocessed-entities](http://localhost:3000/catalog-unprocessed-entities).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
