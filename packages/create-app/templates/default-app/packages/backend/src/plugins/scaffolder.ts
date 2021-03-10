import { SingleHostDiscovery } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import {
  CookieCutter,
  CreateReactAppTemplater,
  createRouter,
  Preparers,
  Publishers,
  Templaters
} from '@backstage/plugin-scaffolder-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  database,
  reader,
}: PluginEnvironment): Promise<Router> {
  const cookiecutterTemplater = new CookieCutter();
  const craTemplater = new CreateReactAppTemplater();
  const templaters = new Templaters();

  templaters.register('cookiecutter', cookiecutterTemplater);
  templaters.register('cra', craTemplater);

  const preparers = await Preparers.fromConfig(config, { logger });
  const publishers = await Publishers.fromConfig(config, { logger });

  const dockerClient = new Docker();

  const discovery = SingleHostDiscovery.fromConfig(config);
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  return await createRouter({
    preparers,
    templaters,
    publishers,
    logger,
    config,
    dockerClient,
    database,
    catalogClient,
    reader
  });
}
