# catalog-graph

> Disclaimer:
> If you are looking for documentation on the experimental new frontend system support, please go [here](./README-alpha.md).

Welcome to the catalog graph plugin! The catalog graph visualizes the relations
between entities, like ownership, grouping or API relationships.

The plugin comes with these features:

- `EntityCatalogGraphCard`:
  A card that displays the directly related entities to the current entity.
  This card is for use on the entity page.
  The card can be customized, for example filtering for specific relations.
  <video src='https://user-images.githubusercontent.com/648527/133401912-aaedc36a-b70b-437e-8e5f-2a14b21962f0.mov'  width=640>

- `CatalogGraphPage`:
  A standalone page that can be added to your application providing a viewer for your entities and their relations.
  The viewer can be used to navigate through the entities and filter for specific relations.
  You can access it from the `EntityCatalogGraphCard`.
  <video src='https://user-images.githubusercontent.com/648527/133403059-6584e469-23ab-41d2-a9e6-fd691a4e2737.mov' width=640>

- `EntityRelationsGraph`:
  A react component that can be used to build own customized entity relation graphs.

## Usage

To use the catalog graph plugin, you have to add some things to your Backstage app:

1. Add a dependency to your `packages/app/package.json`:
   ```sh
   # From your Backstage root directory
   yarn --cwd packages/app add @backstage/plugin-catalog-graph
   ```
2. Add the `CatalogGraphPage` to your `packages/app/src/App.tsx`:

   ```typescript
   <FlatRoutes>
     …
     <Route path="/catalog-graph" element={<CatalogGraphPage />} />…
   </FlatRoutes>
   ```

   You can configure the page to open with some initial filters:

   ```typescript
   <Route
     path="/catalog-graph"
     element={
       <CatalogGraphPage
         initialState={{
           selectedKinds: ['component', 'domain', 'system', 'api', 'group'],
         }}
       />
     }
   />
   ```

3. Bind the external routes of the `catalogGraphPlugin` in your `packages/app/src/App.tsx`:

   ```typescript
   bindRoutes({ bind }) {
     …
     bind(catalogGraphPlugin.externalRoutes, {
       catalogEntity: catalogPlugin.routes.catalogEntity,
     });
     …
   }
   ```

4. Add `EntityCatalogGraphCard` to any entity page that you want in your `packages/app/src/components/catalog/EntityPage.tsx`:

   ```typescript
   <Grid item md={6} xs={12}>
     <EntityCatalogGraphCard variant="gridItem" height={400} />
   </Grid>
   ```

### Customizing the UI

Copy the default implementation `DefaultRenderNode.tsx` and add more classes to the styles:

```typescript
const useStyles = makeStyles(
    theme => ({
        node: {
            …
            '&.system': {
                fill: '#F5DC70',
                stroke: '#F2CE34',
            },
            '&.domain': {
                fill: '#F5DC70',
                stroke: '#F2CE34',
            },
        …
);
```

Now you can use the new classes in your component with `className={classNames(classes.node, kind?.toLowerCase(), type?.toLowerCase())}`

```tsx
return (
  <g onClick={onClick} className={classNames(onClick && classes.clickable)}>
    <rect
      className={classNames(
        classes.node,
        kind?.toLowerCase(),
        type?.toLowerCase(),
      )}
      width={paddedWidth}
      height={paddedHeight}
    />
    <text
      ref={idRef}
      className={classNames(classes.text, focused && 'focused')}
      y={paddedHeight / 2}
      x={paddedWidth / 2}
      textAnchor="middle"
      alignmentBaseline="middle"
    >
      {displayTitle}
    </text>
  </g>
);
```

Once you have your custom implementation, you can follow these steps to modify the required components:

- In the `app.tsx` update the `CatalogGraphPage` component to include your custom styles:

```tsx
<Route path=“/catalog-graph” element={<CatalogGraphPage renderNode={MyCustomRenderNode} />} />
```

- In the `Entity.tsx` file, update the `EntityCatalogGraphCard` component to this:

```tsx
<EntityCatalogGraphCard variant=“gridItem” renderNode={MyCustomRenderNode} height={400} />
```

### Custom relations

Implementers with added custom relations can add them to the catalog graph plugin by overriding the default API. This also allows some relations to not be selected by default.

In `packages/app/src/apis.ts`, import the api ref and create the API as:

```ts
import {
  ALL_RELATIONS,
  ALL_RELATION_PAIRS,
  catalogGraphApiRef,
  DefaultCatalogGraphApi,
} from '@backstage/plugin-catalog-graph';

// ...

  createApiFactory({
    api: catalogGraphApiRef,
    deps: {},
    factory: () =>
      new DefaultCatalogGraphApi({
        // The relations to support
        knownRelations: [...ALL_RELATIONS, 'myRelationOf', 'myRelationFor'],
        // The relation pairs to support
        knownRelationPairs: [
          ...ALL_RELATION_PAIRS,
          ['myRelationOf', 'myRelationFor'],
        ],
        // Select what relations to be shown by default, either by including them,
        // or excluding some from all known relations:
        defaultRelationTypes: {
          // Don't show/select these by default
          exclude: ['myRelationOf', 'myRelationFor'],
        },
      }),
  }),
```

## Development

Run `yarn` in the root of this plugin to install all dependencies and then `yarn start` to run a [development version](./dev/index.tsx) of this plugin.

![dev](https://user-images.githubusercontent.com/1190768/167130527-14d787ce-510d-408a-8f93-45bb94b3a9af.png)
