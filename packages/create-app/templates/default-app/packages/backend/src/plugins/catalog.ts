import {
  createRouter,
  DatabaseEntitiesCatalog,
  DatabaseLocationsCatalog,
  DatabaseManager,
  HigherOrderOperations,
  LocationReaders,
  runPeriodically,
} from '@backstage/plugin-catalog-backend';
import { PluginEnvironment } from '../types';
import { useHotCleanup } from '@backstage/backend-common';

export default async function createPlugin({
  logger,
  database,
}: PluginEnvironment) {
  const locationReader = new LocationReaders(logger);

  const db = await DatabaseManager.createDatabase(database, { logger });
  const entitiesCatalog = new DatabaseEntitiesCatalog(db);
  const locationsCatalog = new DatabaseLocationsCatalog(db);
  const higherOrderOperation = new HigherOrderOperations(
    entitiesCatalog,
    locationsCatalog,
    locationReader,
    logger,
  );

  useHotCleanup(
    module,
    runPeriodically(() => higherOrderOperation.refreshAllLocations(), 10000),
  );

  return await createRouter({
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    logger,
  });
}
