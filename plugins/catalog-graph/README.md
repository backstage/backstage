# catalog-graph

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
   yarn add --cwd packages/app @backstage/plugin-catalog-graph
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
           selectedRelations: [
             RELATION_OWNER_OF,
             RELATION_OWNED_BY,
             RELATION_CONSUMES_API,
             RELATION_API_CONSUMED_BY,
             RELATION_PROVIDES_API,
             RELATION_API_PROVIDED_BY,
             RELATION_HAS_PART,
             RELATION_PART_OF,
             RELATION_DEPENDS_ON,
             RELATION_DEPENDENCY_OF,
           ],
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

## Development

Run `yarn` in the root of this plugin to install all dependencies and then `yarn start` to run a [development version](./dev/index.tsx) of this plugin.

![dev](https://user-images.githubusercontent.com/1190768/167130527-14d787ce-510d-408a-8f93-45bb94b3a9af.png)
