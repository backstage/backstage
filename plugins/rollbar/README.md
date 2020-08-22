# Rollbar Plugin

Website: [https://rollbar.com/](https://rollbar.com/)

## Setup

1. Configure the [rollbar backend plugin](https://github.com/spotify/backstage/tree/master/plugins/rollbar-backend/README.md)

2. If you have standalone app (you didn't clone this repo), then do

```bash
yarn add @backstage/plugin-rollbar
```

3. Add plugin to the list of plugins:

```ts
// packages/app/src/plugins.ts
export { plugin as Rollbar } from '@backstage/plugin-rollbar';
```

4. Add plugin API to your Backstage instance:

```ts
// packages/app/src/api.ts
import { RollbarClient, rollbarApiRef } from '@backstage/plugin-rollbar';

// ...

builder.add(
  rollbarApiRef,
  new RollbarClient({
    apiOrigin: backendUrl,
    basePath: '/rollbar',
  }),
);

// Alternatively you can use the mock client
// builder.add(rollbarApiRef, new RollbarMockClient());
```

5. Run app with `yarn start` and navigate to `/rollbar`

## Features

- List rollbar projects
- View top active items for each project

## Limitations

- Rollbar has rate limits per token

## Links

- [Backend part of the plugin](https://github.com/spotify/backstage/tree/master/plugins/rollbar-backend)
- [The Backstage homepage](https://backstage.io)
