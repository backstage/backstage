# Frontend Plugin Reference

## Extension Blueprint Catalogue

### PageBlueprint

```ts
import { PageBlueprint, createRouteRef } from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef();

export const myPage = PageBlueprint.make({
  params: {
    defaultPath: '/my-plugin',
    loader: () => import('./components/MyPage').then(m => <m.MyPage />),
    routeRef: rootRouteRef,
  },
});
```

### NavItemBlueprint

```ts
import { NavItemBlueprint } from '@backstage/frontend-plugin-api';
import MyIcon from '@material-ui/icons/Extension';

export const myNavItem = NavItemBlueprint.make({
  params: {
    title: 'My Plugin',
    routeRef: rootRouteRef,
    icon: MyIcon,
  },
});
```

### EntityCardBlueprint (catalog-react)

```ts
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';

export const myEntityCard = EntityCardBlueprint.make({
  name: 'overview',
  params: {
    filter: 'kind:component',
    loader: async () => {
      const { MyEntityCard } = await import('./components/MyEntityCard');
      return <MyEntityCard />;
    },
  },
});
```

Filter expressions: `kind:component`, `kind:component,api`, `spec.type:service`, `has:annotation/my.company/my-id`

### EntityContentBlueprint (catalog-react)

```ts
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

export const myEntityContent = EntityContentBlueprint.make({
  name: 'my-tab',
  params: {
    defaultPath: '/my-plugin',
    defaultTitle: 'My Plugin',
    filter: 'kind:component',
    loader: async () => {
      const { MyEntityPage } = await import('./components/MyEntityPage');
      return <MyEntityPage />;
    },
  },
});
```

---

## ApiBlueprint

```ts
import { ApiBlueprint, createApiFactory, discoveryApiRef, fetchApiRef } from '@backstage/frontend-plugin-api';
import { myApiRef, MyApiClient } from '../api';

export const myApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: myApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) => new MyApiClient({ discoveryApi, fetchApi }),
    }),
  },
});
```

## ApiClient pattern (talking to your own backend)

```ts
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export class MyApiClient implements MyApi {
  constructor(private readonly opts: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {}

  private async getBaseUrl() {
    return this.opts.discoveryApi.getBaseUrl('my-plugin');  // matches backend pluginId
  }

  async getData(): Promise<MyData> {
    const baseUrl = await this.getBaseUrl();
    const { json } = await this.opts.fetchApi.fetch(`${baseUrl}/data`);
    if (!json.ok) throw new Error(`Request failed: ${json.status}`);
    return json.json();
  }
}
```

---

## Old System (Legacy) Compatibility

Some older plugins still use the old `createPlugin` from `@backstage/core-plugin-api`. These still work but new plugins should use the new system. The old plugin is typically re-exported from `/alpha` as an adapter:

```ts
// src/alpha.ts — wrapper for new frontend system
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import { myOldPlugin } from './plugin';
export default convertLegacyPlugin(myOldPlugin, { extensions: [...] });
```

---

## Entity Hooks

```ts
import { useEntity, useRelatedEntities } from '@backstage/plugin-catalog-react';

const { entity, loading, error } = useEntity();
const { entities } = useRelatedEntities(entity, { type: 'ownedBy' });
```

## Entity condition helpers

```ts
import {
  isKind,
  hasAnnotation,
  EntitySwitch,
  EntityLayout,
} from '@backstage/plugin-catalog-react';

// In JSX (legacy)
<EntitySwitch>
  <EntitySwitch.Case if={isKind('component')}>
    <MyCard />
  </EntitySwitch.Case>
</EntitySwitch>
```

---

## Component patterns

### InfoCard with data loading

```tsx
import { InfoCard, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { myApiRef } from '../api';

export const MyEntityCard = () => {
  const api = useApi(myApiRef);
  const { value, loading, error } = useAsync(() => api.getData(), []);

  if (loading) return <Progress />;
  if (error) return <ResponseErrorPanel error={error} />;

  return (
    <InfoCard title="My Plugin">
      {/* render value */}
    </InfoCard>
  );
};
```

### Table

```tsx
import { Table, TableColumn } from '@backstage/core-components';

const columns: TableColumn<MyRow>[] = [
  { title: 'Name', field: 'name' },
  { title: 'Status', field: 'status' },
];

<Table title="Items" columns={columns} data={rows} />
```

---

## Dev Runner Setup (dev/index.tsx)

```tsx
import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { myPlugin } from '../src/plugin';
import { TestApiProvider } from '@backstage/test-utils';
import { myApiRef } from '../src/api';

createDevApp()
  .registerPlugin(myPlugin)
  .addPage({
    element: (
      <TestApiProvider apis={[[myApiRef, { getData: async () => mockData }]]}>
        <EntityProvider entity={mockEntity}>
          <MyEntityCard />
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'My Entity Card',
    path: '/my-plugin',
  })
  .render();
```
