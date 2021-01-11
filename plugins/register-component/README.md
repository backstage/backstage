# Register component plugin

> This plugin is deprecated in favor of [`@backstage/catalog-import`](https://github.com/backstage/backstage/tree/master/plugins/catalog-import), and will be soon removed from the project.

Welcome to the register-component plugin!

This plugin allows you to submit your Backstage component using your software's YAML config.

When installed it is accessible on [localhost:3000/register-component](localhost:3000/register-component).

<img src="./src/assets/screenshot-1.png" />
<img src="./src/assets/screenshot-2.png" />
<img src="./src/assets/screenshot-3.png" />
<img src="./src/assets/screenshot-4.png" />
<img src="./src/assets/screenshot-5.png" />

## Standalone setup

0. Install plugin and its dependency `plugin-catalog`

```bash
yarn add @backstage/plugin-register-component -W
yarn add @backstage/plugin-catalog -W
```

1. Add dependencies to the active plugins list

```typescript
// packages/app/src/plugins.ts
export { plugin as RegisterComponent } from '@backstage/plugin-register-component';
export { plugin as CatalogPlugin } from '@backstage/plugin-catalog';
```

2. Create `packages/app/src/apis.ts` and register all the needed plugins

```typescript
import {
  alertApiRef,
  AlertApiForwarder,
  ApiRegistry,
  ConfigApi,
  errorApiRef,
  ErrorApiForwarder,
  ErrorAlerter,
} from '@backstage/core';

import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

export const apis = (config: ConfigApi) => {
  const backendUrl = config.getString('backend.baseUrl');

  const builder = ApiRegistry.builder();

  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(
    catalogApiRef,
    new CatalogClient({
      apiOrigin: backendUrl,
      basePath: '/catalog',
    }),
  );

  return builder.build();
};
```

3. Pass `apis` to createApp

```typescript
// packages/app/src/App.tsx
import { apis } from './apis';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
});
```

## Running

Just run the backstage.

```
yarn start && yarn --cwd packages/backend start
```

## Usage

Pretty straightforward, navigate to [localhost:3000/register-component](localhost:3000/register-component) and enter your component's YAML config URL.
