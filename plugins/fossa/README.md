# FOSSA Plugin

The FOSSA Plugin displays code statistics from [FOSSA](https://fossa.com/).

![FOSSA Card](./docs/fossa-card.png)

## Getting Started

1. Install the FOSSA Plugin:

```bash
# packages/app

yarn add @backstage/plugin-fossa
```

2. Add plugin to the app:

```js
// packages/app/src/plugins.ts

export { fossaPlugin } from '@backstage/plugin-fossa';
```

3. Add the `EntityFossaCard` to the EntityPage:

```jsx
// packages/app/src/components/catalog/EntityPage.tsx

import { EntityFossaCard } from '@backstage/plugin-fossa';

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    // ...
    <Grid item xs={12} sm={6} md={4}>
      <EntityFossaCard />
    </Grid>
    // ...
  </Grid>
);
```

4. Add the proxy config:

```yaml
# app-config.yaml

proxy:
  '/fossa':
    target: https://app.fossa.io/api
    allowedMethods: ['GET']
    headers:
      Authorization:
        # Content: 'token <your-fossa-api-token>'
        $env: FOSSA_AUTH_HEADER

# if you have a fossa organization, configure your id here
fossa:
  organizationId: <your-fossa-organization-id>
```

5. Get an api-token and provide `FOSSA_AUTH_HEADER` as env variable (https://app.fossa.com/account/settings/integrations/api_tokens)

6. Add the `fossa.io/project-name` annotation to your catalog-info.yaml file:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  description: |
    Backstage is an open-source developer portal that puts the developer experience first.
  annotations:
    fossa.io/project-name: YOUR_PROJECT_NAME
spec:
  type: library
  owner: CNCF
  lifecycle: experimental
```
