---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: A number of types and classes have been removed, without a prior deprecation period. These were all very internal, essentially unused by the vast majority of users, and their being exposed was leading to excessive breaking of public interfaces for little-to-zero benefit. So for the 1.0 release of the catalog, the following interface changes have been made (but should have no effect on most users):

- The return type of `CatalogBuilder.build()` now only has the fields `processingEngine` and `router` which is what most users actually consume; the other three fields (`entitiesCatalog`, `locationAnalyzer`, `locationService`) that see very little use have been removed

- The function `createRouter` is removed; use `CatalogBuilder` as follows instead:

  ```ts
  const builder = await CatalogBuilder.create(env);
  // add things as needed, e.g builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
  ```

- The following types were removed:

  - `CatalogProcessingOrchestrator`
  - `CatalogRule`
  - `CatalogRulesEnforcer`
  - `EntityAncestryResponse`
  - `EntityFacetsRequest`
  - `EntityFacetsResponse`
  - `EntityPagination`
  - `EntityProcessingRequest`
  - `EntityProcessingResult`
  - `EntitiesCatalog`
  - `EntitiesRequest`
  - `EntitiesResponse`
  - `LocationService`
  - `LocationInput`
  - `LocationStore`
  - `PageInfo`
  - `RefreshOptions`
  - `RefreshService`
  - `RouterOptions`

- The following classes were removed:

  - `DefaultCatalogProcessingOrchestrator`
  - `DefaultCatalogRulesEnforcer`
