---
id: catalog-customization
title: Catalog Customization
# prettier-ignore
description: How to add custom filters or interface elements to the Backstage software catalog
---

The Backstage software catalog comes with a default `CatalogIndexPage` to filter
and find catalog entities. This is already set up by default by
`@backstage/create-app`.

If you want to change the default index page - such as to add a custom filter to
the catalog - you can replace the routing in `App.tsx` to point to your own
`CatalogIndexPage`.

> Note: The catalog index page is designed to have a minimal code footprint to
> support easy customization, but creating a copy does introduce a possibility
> of drifting out of date over time. Be sure to check the catalog
> [CHANGELOG](https://github.com/backstage/backstage/blob/master/plugins/catalog/CHANGELOG.md)
> periodically.

For example, suppose that I want to allow filtering by a custom annotation added
to entities, `company.com/itgc-enabled`. To start, I'll copy the code for the
default catalog page, either in a new plugin or just in the `app` package:

```tsx
// imports, etc omitted for brevity. for full source see:
// https://github.com/backstage/backstage/blob/master/plugins/catalog/src/components/CatalogPage/CatalogPage.tsx
export const CustomCatalogIndexPage = () => {
  return (
    <CatalogLayout>
      <Content>
        <ContentHeader title="Components">
          <CreateComponentButton />
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <EntityListProvider>
            <div>
              <EntityKindPicker initialFilter="component" hidden />
              <EntityTypePicker />
              <UserListPicker />
              <EntityTagPicker />
            </div>
            <CatalogTable />
          </EntityListProvider>
        </div>
      </Content>
    </CatalogLayout>
  );
};
```

The `EntityListProvider` shown here provides a list of entities from the
`catalog-backend`, and a way to hook in filters. `EntityListProvider` has a
[generic](https://www.typescriptlang.org/docs/handbook/2/generics.html) argument
that can be extended to provide your own filters.

Now we're ready to create a new filter that implements the `EntityFilter`
interface:

```ts
import { EntityFilter } from '@backstage/catalog-react';
import { Entity } from '@backstage/catalog-model';

class ItgcEntityFilter implements EntityFilter {
  filterEntity(entity: Entity): boolean {
    return entity.metadata.annotations?.['company.com/itgc-enabled'] === true;
  }
}
```

The `EntityFilter` interface permits backend filters, which are passed along to
the `catalog-backend` - or frontend filters, which are applied after entities
are loaded from the backend.

Let's create the custom filter shape extending the default and update the
`EntityListProvider` in the custom index page to use it:

```diff
+export type CustomFilters = DefaultEntityFilters & {
+  itgc: ItgcEntityFilter;
+};

export const CustomCatalogIndexPage = () => {
...
        <div className={styles.contentWrapper}>
-          <EntityListProvider>
+          <EntityListProvider<CustomFilters>>
            <div>
...
```

To control this filter, we can create a React component that shows a checkbox.
This component will make use of the `useEntityListProvider` hook, which also
accepts the same generic so we can use the added filter field:

```tsx
export const ItgcPicker = () => {
  const {
    filters: { itgc: currentItgcFilter },
    updateFilters,
  } = useEntityListProvider<CustomFilters>();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    updateFilters({ itgc: enabled ? new ItgcEntityFilter() : undefined });
  }, [enabled, updateFilters]);

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={!!currentItgcFilter}
          onChange={() => setEnabled(isEnabled => !isEnabled)}
          name="itgc-picker"
        />
      }
      label="ITGC Required"
    />
  );
};
```

Now I can add the component to `CustomCatalogIndexPage`:

```diff
export const CustomCatalogIndexPage = () => {
  return (
    ...
          <EntityListProvider>
            <div>
              <EntityKindPicker initialFilter="component" hidden />
              <EntityTypePicker />
              <UserListPicker />
+              <ItgcPicker />
              <EntityTagPicker />
            </div>
            <CatalogTable />
          </EntityListProvider>
    ...
};
```

The same method can be used to customize the _default_ filters with a different
interface - for such usage, the generic argument won't be needed since the
filter shape remains the same as the default.
