---
id: catalog-graph
title: Catalog Graph
description: Visualizing relations between entities in the Software Catalog
---

The Catalog Graph plugin visualizes relationships between entities in the Software Catalog, such as ownership, grouping, and API dependency relationships.

The plugin provides the following components:

- `EntityCatalogGraphCard`: Displays directly related entities to the current entity on an entity page, with support for filtering by specific relation types.
- `CatalogGraphPage`: A standalone page that renders an interactive relation viewer to explore and filter entities across the catalog.
- `EntityRelationsGraph`: A reusable React component for constructing custom relation diagrams.

## Installation

Install the plugin in your frontend app package:

```shell
yarn --cwd packages/app add @backstage/plugin-catalog-graph
```

Once installed, the plugin is discovered and enabled automatically in the new frontend system. For alternative installation methods, see [installing plugins](../../frontend-system/building-apps/05-installing-plugins.md).

To enable the relation graph card on entity pages, add the extension to your `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - entity-card:catalog-graph/relations
```

## Customization

### Customizing node appearance

You can customize node rendering by creating a custom render function. Create a custom component matching the `DefaultRenderNode` interface:

```tsx
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { CustomNodeProps } from '@backstage/plugin-catalog-graph';

const useStyles = makeStyles(theme => ({
  node: {
    '&.system': {
      fill: '#F5DC70',
      stroke: '#F2CE34',
    },
    '&.domain': {
      fill: '#F5DC70',
      stroke: '#F2CE34',
    },
  },
  clickable: {
    cursor: 'pointer',
  },
  text: {
    fill: theme.palette.text.primary,
  },
}));

export const MyCustomRenderNode = ({
  node: { id, title, kind, type, focused },
  onClick,
}: CustomNodeProps) => {
  const classes = useStyles();
  const width = 180;
  const height = 40;

  return (
    <g onClick={onClick} className={classNames(onClick && classes.clickable)}>
      <rect
        className={classNames(
          classes.node,
          kind?.toLowerCase(),
          type?.toLowerCase(),
        )}
        width={width}
        height={height}
      />
      <text
        className={classNames(classes.text, focused && 'focused')}
        y={height / 2}
        x={width / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {title ?? id}
      </text>
    </g>
  );
};
```

Pass the custom node renderer to `<CatalogGraphPage>` and `<EntityCatalogGraphCard>`:

```tsx
<CatalogGraphPage renderNode={MyCustomRenderNode} />
```

```tsx
<EntityCatalogGraphCard
  variant="gridItem"
  renderNode={MyCustomRenderNode}
  height={400}
/>
```

### Custom relations

If you define custom entity relations, register them with the catalog graph API in `packages/app/src/apis.ts`:

```ts title="packages/app/src/apis.ts"
import {
  ALL_RELATIONS,
  ALL_RELATION_PAIRS,
  catalogGraphApiRef,
  DefaultCatalogGraphApi,
} from '@backstage/plugin-catalog-graph';

createApiFactory({
  api: catalogGraphApiRef,
  deps: {},
  factory: () =>
    new DefaultCatalogGraphApi({
      knownRelations: [...ALL_RELATIONS, 'myRelationOf', 'myRelationFor'],
      knownRelationPairs: [
        ...ALL_RELATION_PAIRS,
        ['myRelationOf', 'myRelationFor'],
      ],
      defaultRelationTypes: {
        exclude: ['myRelationOf', 'myRelationFor'],
      },
    }),
});
```

## Legacy frontend system

If your Backstage application uses the legacy frontend system, register the page and card components manually.

1. Register the standalone route in `packages/app/src/App.tsx`:

   ```tsx title="packages/app/src/App.tsx"
   import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';

   // Inside FlatRoutes:
   <Route
     path="/catalog-graph"
     element={
       <CatalogGraphPage
         initialState={{
           selectedKinds: ['component', 'domain', 'system', 'api', 'group'],
         }}
       />
     }
   />;
   ```

2. Bind the external routes of `catalogGraphPlugin` in `packages/app/src/App.tsx`:

   ```ts title="packages/app/src/App.tsx"
   bindRoutes({ bind }) {
     bind(catalogGraphPlugin.externalRoutes, {
       catalogEntity: catalogPlugin.routes.catalogEntity,
     });
   }
   ```

3. Add the card to entity pages in `packages/app/src/components/catalog/EntityPage.tsx`:

   ```tsx title="packages/app/src/components/catalog/EntityPage.tsx"
   import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';

   // Inside the entity grid layout:
   <Grid item md={6} xs={12}>
     <EntityCatalogGraphCard variant="gridItem" height={400} />
   </Grid>;
   ```
