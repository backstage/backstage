---
'@backstage/plugin-techdocs': patch
---

Extend the `DocsTable` component to accept custom user-defined options while still providing default values in case of empty.

**packages/app/src/components/techdocs/CustomTechDocsHome.tsx**

```tsx
import React from 'react';
import { Content } from '@backstage/core-components';
import {
  CatalogFilterLayout,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import {
  TechDocsPageWrapper,
  TechDocsPicker,
  EntityListDocsTable,
} from '@backstage/plugin-techdocs';

export const CustomTechDocsHome = () => {
  const options = {
    paging: false,
    search: false,
    showTitle: false,
    toolbar: false,
  };

  return (
    <TechDocsPageWrapper>
      <Content>
        <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <TechDocsPicker />
              <UserListPicker />
              <EntityOwnerPicker />
              <EntityTagPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <EntityListDocsTable options={options} />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </TechDocsPageWrapper>
  );
};
```

**packages/app/src/App.tsx**

```tsx
import { CustomTechDocsHome } from './components/techdocs/CustomTechDocsHome';

..

const routes = (
  <FlatRoutes>
    ...
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <CustomTechDocsHome />
    </Route>
  </FlatRoutes>
);
```
