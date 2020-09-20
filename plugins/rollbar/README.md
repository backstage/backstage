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
builder.add(rollbarApiRef, new RollbarClient({ discoveryApi }));
```

5. Add to the app `EntityPage` component:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { Router as RollbarRouter } from '@backstage/plugin-rollbar';

// ...
const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    // ...
    <EntityPageLayout.Content
      path="/rollbar"
      title="Errors"
      element={<RollbarRouter entity={entity} />}
    />
  </EntityPageLayout>
);
```

6. Setup the `app.config.yaml` and account token environment variable

```yaml
# app.config.yaml
rollbar:
  organization: spotify
  accountToken:
    $secret:
      env: ROLLBAR_ACCOUNT_TOKEN
```

7. Annotate entities with the rollbar project slug

```yaml
# pump-station-catalog-component.yaml
# ...
metadata:
  annotations:
    rollbar.com/project-slug: organization-name/project-name
    # -- or just ---
    rollbar.com/project-slug: project-name
```

8. Run app with `yarn start` and navigate to `/rollbar` or a catalog entity

## Features

- List rollbar entities that are annotated with `rollbar.com/project-slug`
- View top active items for each rollbar annotated entity

## Limitations

- Rollbar has rate limits per token

## Links

- [Backend part of the plugin](https://github.com/spotify/backstage/tree/master/plugins/rollbar-backend)
- [The Backstage homepage](https://backstage.io)
