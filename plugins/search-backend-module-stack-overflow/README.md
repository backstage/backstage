# search-backend-module-stack-overflow

> DISCLAIMER: The new backend system is in alpha, and so are the search backend module support for the new backend system. We don't recommend you to migrate your backend installations to the new system yet. But if you want to experiment, you can find getting started guides below.

This package exports a module that extends the search backend to also indexing the questions exposed by the [`Stack Overflow` API](https://api.stackexchange.com/docs/questions).

## Installation

Add the module package as a dependency:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-search-backend-module-stack-overflow
```

Add the collator to your backend instance, along with the search plugin itself:

```tsx
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(
  import('@backstage/plugin-search-backend-module-stack-overflow/alpha'),
);
backend.start();
```

You may also want to add configuration parameters to your app-config, for example for controlling the scheduled indexing interval. These parameters should be placed under the `stackoverflow` key. See [the config definition file](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-stack-overflow/config.d.ts) for more details.
