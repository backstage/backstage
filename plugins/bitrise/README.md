# Bitrise

Welcome to the Bitrise plugin!

- View recent Bitrise Builds for a Bitrise application
- Download build artifacts

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-bitrise
```

Bitrise Plugin exposes an entity tab component named `EntityBitriseContent`. You can include it in the
[`EntityPage.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/components/catalog/EntityPage.tsx)`:

```tsx
// At the top imports
import { EntityBitriseContent } from '@backstage/plugin-bitrise';

// Farther down at the website declaration
const websiteEntityPage = (
  <EntityLayout>
    {/* Place the following section where you want the tab to appear */}
    <EntityLayout.Route path="/bitrise" title="Bitrise">
      <EntityBitriseContent />
    </EntityLayout.Route>
```

Your plugin should now appear as a tab at the top of entity pages, particularly for `website` component types.
However, it alerts you to a missing `bitrise.io/app` annotation.

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
      Authorization: ${BITRISE_AUTH_TOKEN}
```

Learn how to generate a new Bitrise token at https://devcenter.bitrise.io/api/authentication.
