---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: Removed all remnants of the old catalog engine implementation.

The old implementation has been deprecated for over half a year. To ensure that
you are not using the old implementation, check that your
`packages/backend/src/plugins/catalog.ts` creates the catalog builder using
`CatalogBuilder.create`. If you instead call `new CatalogBuilder`, you are on
the old implementation and will experience breakage if you upgrade to this
version. If you are still on the old version, see [the relevant change log
entry](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/CHANGELOG.md#patch-changes-27)
for migration instructions.

The minimal `packages/backend/src/plugins/catalog.ts` file is now:

```ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
```

The following classes and interfaces have been removed:

- The `CatalogBuilder` constructor (see above; use `CatalogBuilder.create`
  instead)
- `AddLocationResult`
- `CommonDatabase`
- `CreateDatabaseOptions`
- `createNextRouter` (use `createRouter` instead - or preferably, use the
  `router` field returned for you by `catalogBuilder.build()`)
- `Database`
- `DatabaseEntitiesCatalog` (use `EntitiesCatalog` instead)
- `DatabaseLocationsCatalog` (use `LocationService` instead)
- `DatabaseLocationUpdateLogEvent`
- `DatabaseLocationUpdateLogStatus`
- `DatabaseManager`
- `DbEntitiesRequest`
- `DbEntitiesResponse`
- `DbEntityRequest`
- `DbEntityResponse`
- `DbLocationsRow`
- `DbLocationsRowWithStatus`
- `DbPageInfo`
- `EntitiesCatalog.batchAddOrUpdateEntities` (was only used by the legacy
  engine)
- `EntityUpsertRequest`
- `EntityUpsertResponse`
- `HigherOrderOperation`
- `HigherOrderOperations`
- `LocationReader`
- `LocationReaders`
- `LocationResponse`
- `LocationsCatalog`
- `LocationUpdateLogEvent`
- `LocationUpdateStatus`
- `NextCatalogBuilder` (use `CatalogBuilder.create` instead)
- `NextRouterOptions` (use `RouterOptions` instead)
- `ReadLocationEntity`
- `ReadLocationError`
- `ReadLocationResult`
- `Transaction`

The `RouterOptions` interface has been un-deprecated, and has instead found use
for passing into `createRouter`. Its shape has been significantly changed to
accommodate the new router.
