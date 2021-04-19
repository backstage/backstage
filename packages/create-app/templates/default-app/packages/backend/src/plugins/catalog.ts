import { useHotCleanup } from '@backstage/backend-common';
import {
  CatalogBuilder,
  createRouter,
  runPeriodically
} from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
  const builder = new CatalogBuilder(env);
  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer,
  } = await builder.build();

  const refreshLoopMs =
    env.config.getOptionalNumber('backend.refreshLoopMs') || 100000;

  useHotCleanup(
    module,
    runPeriodically(
      () => higherOrderOperation.refreshAllLocations(),
      refreshLoopMs,
    ),
  );

  return await createRouter({
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer,
    logger: env.logger,
    config: env.config,
  });
}
