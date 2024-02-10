---
id: catalog-customization
title: Catalog Customization
# prettier-ignore
description: How to add custom filters or interface elements to the Backstage software catalog
---

The Backstage software catalog comes with a default `CatalogIndexPage` to filter and find catalog entities. This is already set up by default by `@backstage/create-app`. If you want to change the default index page - to set the initially selected filter, adjust columns, add actions, or to add a custom filter to the catalog - the following sections will show you how.

## Pagination

Initial support for pagination of the `CatalogIndexPage` was added in v1.21.0 of Backstage, make sure you are on that version or newer to use this feature. To enable pagination you simply need to pass in the `paganiaiton` prop like this:

```tsx title="packages/app/src/App.tsx"
<Route path="/catalog" element={<CatalogIndexPage pagination />} />
```

## Initially Selected Filter

By default the initially selected filter defaults to Owned, now you might be still building up your catalog and would prefer this to show All as the deafult. Here's how you can make that change:

```tsx title="packages/app/src/App.tsx"
<Route
  path="/catalog"
  element={<CatalogIndexPage initiallySelectedFilter="all" />}
/>
```

Possible options are: owned, starred, or all

## Initially Selected Kind

By default the initially selected Kind when viewing the Catalog in Component, but you may have reasons that you want this to be different. Let's say at your Organization they would like it to always default to Domain, here's how you would do that:

```tsx title="packages/app/src/App.tsx"
<Route path="/catalog" element={<CatalogIndexPage initialKind="domain" />} />
```

Possible options are all the [default Kinds](system-model.md) as well as any custom Kinds that you have added.

## Owner Picker Mode

The Owner filter by default will only contain a list of Users and/or Groups that actually own an entity in the Catalog, now you may have reason to change this. Here's how:

```tsx title="packages/app/src/App.tsx"
<Route path="/catalog" element={<CatalogIndexPage ownerPickerMode="all" />} />
```

Possible options are: owners-only or all

## Customize Columns

By default the columns you see in the `CatalogIndexPage` were selected to be a good starting point for most but there may be reasons that you would like to customize these with more or less columns. On primary use case for this customization is if you added a custom Kind. Support for this was added in v1.23.0 of Backstage, make sure you are on that version or newer to use this feature. Here's an example of how to make this customization:

```tsx title="packages/app/src/App.tsx"
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
  {/* highlight-add-start */}
  CatalogTable,
  CatalogTableColumnsFunc,
  {/* highlight-add-end */}
} from '@backstage/plugin-catalog';

{/* highlight-add-start */}
const myColumnsFunc: CatalogTableColumnsFunc = entityListContext => {
  if (entityListContext.filters.kind?.value === 'MyKind') {
    return [
      CatalogTable.columns.createNameColumn(),
      CatalogTable.columns.createOwnerColumn(),
    ];
  }

  return CatalogTable.defaultColumnsFunc(entityListContext);
};
{/* highlight-add-end */}

{/* highlight-remove-next-line */}
<Route path="/catalog" element={<CatalogIndexPage />} />
{/* highlight-add-next-line */}
<Route path="/catalog" element={<CatalogIndexPage columns={myColumnsFunc} />} />
```

> Note: the above example has been simplified and you will most likely have more code then just this in your `App.tsx` file.

## Customize Actions

The `CatalogIndexPage` comes with three default actions - view, edit, and star. You might want to add more here's how:

First you'll need to add `@mui/utils` to your `packages/app/package.json`:

```sh
yarn --cwd packages/app add @mui/utils
```

Then you'll do the following:

```tsx title="packages/app/src/App.tsx"
import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
  {/* highlight-add-next-line */}
  TableProps,
} from '@backstage/core-components';

import {
  CatalogEntityPage,
  CatalogIndexPage,
  {/* highlight-add-next-line */}
  CatalogTableRow,
  catalogPlugin,
} from '@backstage/plugin-catalog';

{/* highlight-add-start */}
import { Typography } from '@material-ui/core';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { visuallyHidden } from '@mui/utils';
{/* highlight-add-end */}

{/* highlight-add-start */}
const customActions: TableProps<CatalogTableRow>['actions'] = [
  ({ entity }) => {
    const url = 'https://backstage.io/';
    const title = `View - ${entity.metadata.name}`;

    return {
      icon: () => (
        <>
          <Typography style={visuallyHidden}>{title}</Typography>
          <OpenInNew fontSize="small" />
        </>
      ),
      tooltip: title,
      disabled: !url,
      onClick: () => {
        if (!url) return;
        window.open(url, '_blank');
      },
    };
  },
];
{/* highlight-add-end */}

{/* highlight-remove-next-line */}
<Route path="/catalog" element={<CatalogIndexPage />} />
{/* highlight-add-next-line */}
<Route path="/catalog" element={<CatalogIndexPage actions={customActions} />} />
```

> Note: the above example has been simplified and you will most likely have more code then just this in your `App.tsx` file.

The above customization will override the existing actions. Currently the only way to keep them and add your own is to also include the existing actions in your array by copying them from the [`defaultActions`](https://github.com/backstage/backstage/blob/57397e7d6d2d725712c439f4ab93f2ac6aa27bf8/plugins/catalog/src/components/CatalogTable/CatalogTable.tsx#L113-L168).

## Custom Filters

You can add custom filters. For example, suppose that I want to allow filtering by a custom annotation added to entities, `company.com/security-tier`. Her's how we can built a filter to support that need.

First we need to create a new filter that implements the `EntityFilter` interface:

```ts
import { EntityFilter } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

class EntitySecurityTierFilter implements EntityFilter {
  constructor(readonly values: string[]) {}
  filterEntity(entity: Entity): boolean {
    const tier = entity.metadata.annotations?.['company.com/security-tier'];
    return tier !== undefined && this.values.includes(tier);
  }
}
```

The `EntityFilter` interface permits backend filters, which are passed along to the `catalog-backend` - or frontend filters, which are applied after entities are loaded from the backend.

We'll use this filter to extend the default filters in a type-safe way. Let's create the custom filter shape extending the default somewhere alongside this filter:

```ts
export type CustomFilters = DefaultEntityFilters & {
  securityTiers?: EntitySecurityTierFilter;
};
```

To control this filter, we can create a React component that shows checkboxes for the security tiers. This component will make use of the `useEntityList` hook, which accepts this extended filter type as a [generic](https://www.typescriptlang.org/docs/handbook/2/generics.html) parameter:

```tsx
export const EntitySecurityTierPicker = () => {
  // The securityTiers key is recognized due to the CustomFilter generic
  const {
    filters: { securityTiers },
    updateFilters,
  } = useEntityList<CustomFilters>();

  // Toggles the value, depending on whether it's already selected
  function onChange(value: string) {
    const newTiers = securityTiers?.values.includes(value)
      ? securityTiers.values.filter(tier => tier !== value)
      : [...(securityTiers?.values ?? []), value];
    updateFilters({
      securityTiers: newTiers.length
        ? new EntitySecurityTierFilter(newTiers)
        : undefined,
    });
  }

  const tierOptions = ['1', '2', '3'];
  return (
    <FormControl component="fieldset">
      <Typography variant="button">Security Tier</Typography>
      <FormGroup>
        {tierOptions.map(tier => (
          <FormControlLabel
            key={tier}
            control={
              <Checkbox
                checked={securityTiers?.values.includes(tier)}
                onChange={() => onChange(tier)}
              />
            }
            label={`Tier ${tier}`}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
```

Now we can add the component to `CatalogIndexPage`:

```tsx title="packages/app/src/App.tsx"
const routes = (
  <FlatRoutes>
    <Navigate key="/" to="catalog" />
    {/* highlight-remove-next-line */}
    <Route path="/catalog" element={<CatalogIndexPage />} />
    {/* highlight-add-start */}
    <Route
      path="/catalog"
      element={
        <CatalogIndexPage
          filters={
            <>
              <EntityKindPicker />
              <EntityTypePicker />
              <UserListPicker />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
              <EntityProcessingStatusPicker />
              <EntityNamespacePicker />
              <EntitySecurityTierPicker />
            </>
          }
        />
      }
    />
    {/* highlight-add-end */}
    {/* ... */}
  </FlatRoutes>
);
```

The same method can be used to customize the _default_ filters with a different interface - for such usage, the generic argument isn't needed since the filter shape remains the same as the default.
