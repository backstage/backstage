---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
---

Added new `EntityProcessingStatusPicker` that will filter for entities with orphans and/or errors.

If you are using the default Catalog page this picker will be added automatically. For those who have customized their Catalog page you'll need to add this manually by doing something like this:

```diff
...
import {
  CatalogFilterLayout,
  EntityTypePicker,
  UserListPicker,
  EntityTagPicker
+ EntityProcessingStatusPicker,
} from '@backstage/plugin-catalog-react';
...
export const CustomCatalogPage = ({
  columns,
  actions,
  initiallySelectedFilter = 'owned',
}: CatalogPageProps) => {
  return (
    ...
        <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityKindPicker initialFilter="component" hidden />
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityTagPicker />
+             <EntityProcessingStatusPicker />
            <CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <CatalogTable columns={columns} actions={actions} />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
    ...
};
```
