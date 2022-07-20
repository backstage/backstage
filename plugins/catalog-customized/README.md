# Backstage Catalog Frontend

This is the React frontend to customize Backstage [software
catalog](http://backstage.io/docs/features/software-catalog/software-catalog-overview).
This package supplies the example how it can be achieved.

## Installation

This `@internal/plugin-catalog-customized` package comes installed by default in example application of
Backstage application.

To check if you already have the package, look under
`packages/app/package.json`, in the `dependencies` block, for
`@internal/plugin-catalog-customized`. The instructions below walk through restoring the
plugin, if you previously removed it.

### Install the package

```bash
# From your Backstage root directory
yarn add --cwd packages/app @internal/plugin-catalog-customized
```

### Add the plugin to your `packages/app`

Add the import to a file where is your plugin catalog is defined:

```diff
// packages/app/src/App.tsx

import from '@internal/plugin-catalog-customized';

...

import {
  CatalogIndexPage,
  CatalogEntityPage,
} from '@backstage/plugin-catalog';

...
```

## Development

This frontend plugin can be started in a standalone mode from directly in this
package with `yarn start`. However, it will have limited functionality and that
process is most convenient when developing the catalog frontend plugin itself.

To evaluate the catalog and have a greater amount of functionality available,
run the entire Backstage example application from the root folder:

```bash
yarn dev
```

This will launch both frontend and backend in the same window, populated with
some example entities.
