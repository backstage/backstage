# codescene

[CodeScene](https://codescene.com/) is a multi-purpose tool bridging code, business and people. See hidden risks and social patterns in your code. Prioritize and reduce technical debt.

![codescene-logo](./src/assets/codescene.icon.svg)

The CodeScene Backstage Plugin exposes a page component that will list the existing projects and their analysis data on your CodeScene instance.

![screenshot](./docs/codescene-plugin-screenshot.png)

## Setup

1. Install the plugin by running:

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-codescene
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
