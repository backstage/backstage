import { DockerContainerRunner } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  database,
  reader,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  return await createRouter({
    containerRunner,
    logger,
    config,
    database,
    catalogClient,
    reader,
  });
}
