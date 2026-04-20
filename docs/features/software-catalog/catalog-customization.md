---
id: catalog-customization
title: Catalog Customization
description: How to add custom filters or interface elements to the Backstage software catalog
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./catalog-customization--old.md)
instead.
::::

The Backstage software catalog comes with a default catalog index page and entity pages that are highly configurable through `app-config.yaml`. This guide covers how to customize the catalog in the new frontend system.

## Catalog index page

The catalog index page can be configured through extensions in `app-config.yaml`. For example, to enable pagination:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:catalog:
        config:
          pagination: true
```

You can also configure pagination with additional options:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:catalog:
        config:
          pagination:
            mode: offset
            limit: 20
```

### Catalog filters

The catalog index page includes a set of default filters (kind, type, owner, lifecycle, tag, namespace, processing status). These filters can be configured through extensions. For example, to set the initial kind filter:

```yaml title="app-config.yaml"
app:
  extensions:
    - catalog-filter:catalog/kind:
        config:
          initialFilter: domain
```

To set the initial list filter to "all" instead of "owned":

```yaml title="app-config.yaml"
app:
  extensions:
    - catalog-filter:catalog/list:
        config:
          initialFilter: all
```

### Custom filters

You can create custom catalog filters using the `CatalogFilterBlueprint` from `@backstage/plugin-catalog-react/alpha`. For example, to add a custom security tier filter:

```tsx title="packages/app/src/catalog/SecurityTierFilter.tsx"
import { CatalogFilterBlueprint } from '@backstage/plugin-catalog-react/alpha';

export const securityTierFilter = CatalogFilterBlueprint.make({
  name: 'security-tier',
  params: {
    loader: async () => {
      const { EntitySecurityTierPicker } = await import(
        './EntitySecurityTierPicker'
      );
      return <EntitySecurityTierPicker />;
    },
  },
});
```

Then install it as a frontend module:

```tsx title="packages/app/src/catalog/catalogCustomizations.tsx"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { securityTierFilter } from './SecurityTierFilter';

export default createFrontendModule({
  pluginId: 'catalog',
  extensions: [securityTierFilter],
});
```

Then register the module in your app:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import catalogCustomizations from './catalog/catalogCustomizations';

const app = createApp({
  features: [catalogCustomizations],
});

export default app.createRoot();
```

### Removing default filters

Default filters can be disabled through `app-config.yaml` by setting them to `false`:

```yaml title="app-config.yaml"
app:
  extensions:
    - catalog-filter:catalog/lifecycle: false
    - catalog-filter:catalog/tag: false
    - catalog-filter:catalog/processing-status: false
```

## Customizing columns, actions, and table options

In the old frontend system, customizing the catalog table columns, row actions,
and table options was done by passing props directly to the `CatalogIndexPage`
component. In the new frontend system, these customizations are done by
overriding the `page:catalog` extension.

For example, to customize the catalog index page with custom columns or actions,
you can override the page extension using a frontend module:

```tsx title="packages/app/src/catalog/customCatalogPage.tsx"
import {
  PageBlueprint,
  createFrontendModule,
  createRouteRef,
} from '@backstage/frontend-plugin-api';

const customCatalogPage = PageBlueprint.make({
  params: {
    path: '/catalog',
    routeRef: createRouteRef({ aliasFor: 'catalog.catalogIndex' }),
    loader: async () => {
      const { CustomCatalogPage } = await import('./CustomCatalogPage');
      return <CustomCatalogPage />;
    },
  },
});

export default createFrontendModule({
  pluginId: 'catalog',
  extensions: [customCatalogPage],
});
```

Inside your custom catalog page component you have full control over the table
columns, actions, and options. You can compose a page using components from
`@backstage/plugin-catalog` and `@backstage/plugin-catalog-react`:

```tsx title="packages/app/src/catalog/CustomCatalogPage.tsx"
import {
  PageWithHeader,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { CatalogTable } from '@backstage/plugin-catalog';
import {
  EntityListProvider,
  CatalogFilterLayout,
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityNamespacePicker,
  EntityOwnerPicker,
  EntityProcessingStatusPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';

export const CustomCatalogPage = () => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';

  return (
    <PageWithHeader title={orgName} themeId="home">
      <Content>
        <ContentHeader title="">
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <EntityListProvider pagination>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityKindPicker />
              <EntityTypePicker />
              <UserListPicker />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
              <EntityProcessingStatusPicker />
              <EntityNamespacePicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <CatalogTable />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </PageWithHeader>
  );
};
```

:::note Note

The catalog index page is designed to have a minimal code footprint to support
easy customization, but creating a replica does introduce a possibility of
drifting out of date over time. Be sure to check the catalog
[CHANGELOG](https://github.com/backstage/backstage/blob/master/plugins/catalog/CHANGELOG.md)
periodically.

:::

For more details on extension overrides and the different override patterns
available, see the [extension overrides](../../frontend-system/architecture/25-extension-overrides.md) documentation.

## Entity page

### Entity filters

Many extensions that attach within the catalog entity pages accept a `filter` configuration. The purpose of the `filter` configuration is to select what entities the extension should be applied to or be present on. Many of these extension will have a default filter defined, but you can override it by providing your own. When defining filters in code you can use either a predicate function or a entity predicate query, while in configuration you can only use an entity predicate query.

### Entity predicate queries

The entity predicate syntax is a minimal JSON-based query language for filtering catalog entities. It is loosely inspired by the [MongoDB query syntax](https://www.mongodb.com/docs/manual/tutorial/query-documents/), behaving roughly the same way but with a different set of operators.

The most simple entity predicate is an object expression with key-value mappings where the key is the full dot-separated path to the value in the entity, and the value is the value to do a case insensitive match against. Each entry in this object is evaluated separately, but all of them must match for the overall predicate to result in a match. For example, the following will match any component entities of the type `service`:

```json
{
  "filter": {
    "kind": "component",
    "spec.type": "service"
  }
}
```

Or when utilizing YAML syntax:

```yaml
filter:
  kind: component
  spec.type: service
```

In addition to this basic syntax, entity predicates support logical operators that can be nested and applied around these object expressions. For example, the following will match all components entities that are of type `service` or `website`:

```json
{
  "filter": {
    "$all": [
      {
        "kind": "component"
      },
      {
        "$any": [{ "spec.type": "service" }, { "spec.type": "website" }]
      }
    ]
  }
}
```

Or when utilizing YAML syntax:

```yaml
filter:
  $all:
    - kind: component
    - $any:
        - spec.type: service
        - spec.type: website
```

Finally, entity predicates also support value operators that can be used in place of the values in the object expression. For example, the following is a simpler way to express the previous example:

```json
{
  "filter": {
    "kind": "component",
    "spec.type": { "$in": ["service", "website"] }
  }
}
```

Or when utilizing YAML syntax:

```yaml
filter:
  kind: component
  spec.type:
    $in: [service, website]
```

### Entity predicate logical operators

The following section lists all logical operators for entity predicates.

#### `$all`

The `$all` operator has the following syntax:

```json
{ $all: [ { <expression1> }, { <expression2> }, ...] }
```

The `$all` operator evaluates to `true` if all expressions within the provided array evaluate to `true`. This includes an empty array, which means that `{ "$all": [] }` always evaluates to `true`.

```yaml title="Example usage of $all"
filter:
  $all:
    - kind: component
    - $not:
        spec.type: service
```

#### `$any`

The `$any` operator has the following syntax:

```json
{ $any: [ { <expression1> }, { <expression2> }, ...] }
```

The `$any` operator evaluates to `true` if at least one of the expressions within the provided array evaluate to `true`. This includes an empty array, which means that `{ "$any": [] }` always evaluates to `false`.

```yaml title="Example usage of $any"
filter:
  $any:
    - kind: component
    - metadata.annotations.github.com/project-slug: { $exists: true }
```

#### `$not`

The `$not` operator has the following syntax:

```json
{ $not: { <expression> } }
```

The `$not` operator inverts the result of the provided express. If the expression evaluates to `true` then `$not` will evaluate to false, and the other way around.

```yaml title="Example usage of $not"
filter:
  $not:
    kind: template
```

### Entity predicate value operators

The following section lists all value operators for entity predicates.

#### `$exists`

The `$exists` operator has the following syntax:

```json
{ field: { $exists: <boolean> } }
```

The `$exists` operator will evaluate to `true` if the existence of the value it matches against matches the provided boolean. That is `{ $exists: true }` will evaluate to `true` if and only if the value is defined, and `{ $exists: false }` will evaluate to `true` if and only if the value is not defined.

```yaml title="Example usage of $exists"
filter:
  metadata.annotations.github.com/project-slug: { $exists: true }
```

#### `$in`

The `$in` operator has the following syntax:

```json
{ field: { $in: [ <primitive1>, <primitive2>, ... ] } }
```

The `$in` operator will evaluate to `true` if the value it is matched against is exists within the array of primitives. The comparison is case insensitive and can only be done across primitive values. If the value matched against is an object or array, the operator will always evaluate to `false`.

```yaml title="Example usage of $in"
filter:
  kind:
    $in: [component, api]
```

#### `$contains`

The `$contains` operator has the following syntax:

```json
{ field: { $contains: { <expression> } } }
```

The `$contains` operator will evaluate to `true` if the value it is matched against is an array, and at least one of the elements in the array fully matches the provided expression. If the value matched against is not an array, or if the array is empty, the operator will always evaluate to `false`.

The expression used to match against the array can be any valid entity predicate expression, including logical operators and value operators.

```yaml title="Example usage of $contains"
filter:
  relations:
    $contains:
      type: ownedBy
      targetRef:
        $in: [group:default/admins, group:default/viewers]
```

### Configure groups, titles, and icons

You can define and customize the tab groups that appear on the entity page, as well as enable icons for both groups and individual tabs.

```yaml
app:
  extensions:
    # Entity page (new frontend system)
    - page:catalog/entity:
        config:
          # Show icons next to group and tab titles
          showNavItemIcons: true

          # Optionally override default groups and their icons
          groups:
            - overview:
                title: Overview
                icon: dashboard
            - quality:
                title: Quality
                icon: verified
            - documentation:
                title: Docs
                icon: description
```

Notes:

- Icons for groups and tabs are resolved via the app's IconsApi. When using a string icon id (for example `"dashboard"`), ensure that the corresponding icon bundles are enabled/installed in your app (see the [IconBundleBlueprint documentation](https://backstage.io/api/stable/variables/_backstage_plugin-app-react.IconBundleBlueprint.html)).
- Group icons are only rendered if `showNavItemIcons` is set to `true`.

### Content ordering within groups

By default, content items within each group are sorted alphabetically by title. You can change this with the `defaultContentOrder` option, which supports two modes:

- **`title`** (default) — sort alphabetically by the content extension's title (case-insensitive).
- **`natural`** — preserve the natural extension discovery/registration order.

A page-level `defaultContentOrder` sets the default for all groups, and individual groups can override it with a per-group `contentOrder`:

```yaml
app:
  extensions:
    - page:catalog/entity:
        config:
          # Default content order for all groups
          defaultContentOrder: title

          groups:
            - documentation:
                title: Docs
                # Override: keep natural order for this group
                contentOrder: natural
```

Note that content ordering only applies to content items within groups. Ungrouped tabs (those not matching any group definition) always retain their natural order.

### Group aliases

Groups can declare `aliases` — a list of other group IDs that should be treated as equivalent. Any entity content extension targeting an aliased group ID will be included in the aliasing group. This is useful when renaming or merging groups without having to reconfigure individual extensions:

```yaml
app:
  extensions:
    - page:catalog/entity:
        config:
          groups:
            - develop:
                title: Develop
                # Content targeting 'development' will appear in this group
                aliases:
                  - development
```

### Overriding or disabling a tab's group (per extension)

Each entity content extension (tabs on the entity page) can declare a default `group` in code. You can override or disable this per installation in `app-config.yaml` using the extension's config:

```yaml
app:
  extensions:
    # ...
    # Example entity content extension instance id
    - entity-content:example/my-content:
        config:
          # Move this tab to a custom group you defined above
          group: custom
          # Show an icon for this entity content page but only if `showNavItemIcons` is enabled for the `page:catalog/entity` extension
          icon: my-icon

    # Disassociate from any group and show as a standalone tab
    - entity-content:example/another-content:
        config:
          group: false
```

### Tab icons for entity content

Entity content extensions can also declare an `icon` parameter. When provided as a string, the icon id is looked up via the IconsApi. For the icon to render:

- The entity page must have `showNavItemIcons: true` (see configuration above).
- The icon id must be available in the app's enabled icon bundles.
