# Scaffolder Frontend

This is the React frontend for the default Backstage [software
templates](https://backstage.io/docs/features/software-templates/).
This package supplies interfaces related to showing available templates in the
Backstage catalog and the workflow to create software using those templates.

## Installation

This `@backstage/plugin-scaffolder` package comes installed by default in any
Backstage application created with `npx @backstage/create-app`, so installation
is not usually required.

To check if you already have the package, look under
`packages/app/package.json`, in the `dependencies` block, for
`@backstage/plugin-scaffolder`. The instructions below walk through restoring
the plugin, if you previously removed it.

### Install the package

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-scaffolder
```

### Add the plugin to your `packages/app`

Add the root page that the scaffolder plugin provides to your app. You can
choose any path for the route, but we recommend the following:

```diff
// packages/app/src/App.tsx
+import { ScaffolderPage } from '@backstage/plugin-scaffolder';


<FlatRoutes>
  <Route path="/catalog" element={<CatalogIndexPage />} />
  <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
    {entityPage}
  </Route>
+  <Route path="/create" element={<ScaffolderPage />} />;
  ...
</FlatRoutes>
```

The scaffolder plugin also has one external route that needs to be bound for it
to function: the `registerComponent` route which should link to the page where
the user can register existing software component. In a typical setup, the
register component route will be linked to the `catalog-import` plugin's import
page:

```diff
// packages/app/src/App.tsx
+import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
+import { catalogImportPlugin } from '@backstage/plugin-catalog-import';

const app = createApp({
  // ...
  bindRoutes({ bind }) {
+    bind(scaffolderPlugin.externalRoutes, {
+      registerComponent: catalogImportPlugin.routes.importPage,
+    });
  },
});
```

You may also want to add a link to the scaffolder page to your application
sidebar:

```diff
// packages/app/src/components/Root/Root.tsx
+import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
+      <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />;
      ...
    </Sidebar>
```

### Troubleshooting

If you encounter the [issue of closing EventStream](https://github.com/backstage/backstage/issues/5535)
which auto-updates logs during task execution, you can enable long polling. To do so,
update your `packages/app/src/apis.ts` file to register a `ScaffolderClient` with the
`useLongPollingLogs` set to `true`. By default, it is `false`.

```typescript
import {
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  scaffolderApiRef,
  ScaffolderClient,
} from '@backstage/plugin-scaffolder';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ scmIntegrationsApi, discoveryApi, identityApi, fetchApi }) =>
      new ScaffolderClient({
        discoveryApi,
        identityApi,
        scmIntegrationsApi,
        fetchApi,
        useLongPollingLogs: true,
      }),
  }),
  // ... other factories
```

This replaces the default implementation of the `scaffolderApiRef`.

## Links

- [scaffolder-backend](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend)
  provides the backend API for this frontend.
