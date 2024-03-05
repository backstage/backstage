# codescene

[CodeScene](https://codescene.com/) is a multi-purpose tool that connects code, businesses, and people. Discover hidden hazards and social trends in your code. Prioritise and minimise technical debt.

The CodeScene Backstage Plugin provides a page component that displays a list of existing projects and associated analysis data on your CodeScene instance.

![screenshot](./docs/codescene-plugin-screenshot.png)

## Setup

1. Install the plugin by running:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-codescene
```

2. Add the routes and pages to your `App.tsx`:

```tsx
import {
  CodeScenePage,
  CodeSceneProjectDetailsPage,
} from '@backstage/plugin-codescene';

...

<Route path="/codescene" element={<CodeScenePage />} />
<Route
    path="/codescene/:projectId"
    element={<CodeSceneProjectDetailsPage />}
/>
```

3. Add to the sidebar item routing to the new page:

```tsx
// In packages/app/src/components/Root/Root.tsx
import { CodeSceneIcon } from '@backstage/plugin-codescene';

{
  /* other sidebar items... */
}
<SidebarItem icon={CodeSceneIcon} to="codescene" text="CodeScene" />;
```

4. Setup the `app-config.yaml` `codescene` proxy and configuration blocks:

```yaml
proxy:
  '/codescene-api':
    target: '<INSTANCE_HOSTNAME>/api/v1'
    allowedMethods: ['GET']
    allowedHeaders: ['Authorization']
    headers:
      Authorization: Basic ${CODESCENE_AUTH_CREDENTIALS}
```

```yaml
codescene:
  baseUrl: https://codescene.my-company.net # replace with your own URL
```

5. Adding the codescene plugin to Entity page:

```yaml
# Add `codescene` annotations to the `catalog-info.yaml` of an entity.
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  annotations:
    codescene.io/project-id: <codescene-project-id>
```

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx

import {
  CodeSceneEntityPage,
  CodeSceneEntityFileSummary,
  isCodeSceneAvailable,
} from '@backstage/plugin-codescene';

/* other EntityLayout.Route items... */

<EntityLayout.Route
  path="/codescene"
  title="codescene"
  if={isCodeSceneAvailable}
>
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <CodeSceneEntityKPICard />
    </Grid>
    <Grid item md={6}>
      <CodeSceneEntityFileSummary />
    </Grid>
  </Grid>
</EntityLayout.Route>;
```
