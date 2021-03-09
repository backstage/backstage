# Bitrise

Welcome to the Bitrise plugin!

- View recent Bitrise Builds for a Bitrise application
- Download build artifacts

## Installation

```sh
$ yarn add @backstage/plugin-bitrise
```

Then make sure to export the plugin in your app's [`plugins.ts`](https://github.com/backstage/backstage/blob/master/packages/app/src/plugins.ts) to enable the plugin:

```js
export { bitrisePlugin } from '@backstage/plugin-bitrise';
```

Bitrise Plugin exposes an "Entity Tab Content" component `EntityBitriseContent`. You can include it in the [`EntityPage.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/components/catalog/EntityPage.tsx)`:

```tsx
// At the top imports
import { EntityBitriseContent } from '@backstage/plugin-bitrise';

// Inside `WebsiteEntityPage` component
<EntityPageLayout.Content
  path="/bitrise"
  title="Bitrise"
  element={
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <EntityBitrisePage />
      </Grid>
    </Grid>
  }
/>;
```

Now your plugin should be visible in the entity page, however in a state with a missing `bitrise.io/app` annotation.

Add the annotation to your component [catalog-info.yaml](https://github.com/backstage/backstage/blob/master/catalog-info.yaml) as shown in the highlighted example below:

```yaml
metadata:
  annotations:
    bitrise.io/app: '<THE NAME OF THE BITRISE APP>'
```

The plugin requires to configure a Bitrise API proxy with a `BITRISE_AUTH_TOKEN` for authentication in the [app-config.yaml](https://github.com/backstage/backstage/blob/master/app-config.yaml):

```yaml
proxy:
  '/bitrise':
    target: 'https://api.bitrise.io/v0.1'
    allowedMethods: ['GET']
    headers:
      Authorization:
        $env: BITRISE_AUTH_TOKEN
```

Learn on https://devcenter.bitrise.io/api/authentication how to create a new Bitrise token.
