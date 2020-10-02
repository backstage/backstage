import { createRouter } from '@backstage/plugin-auth-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  databaseClientFactory,
  config,
  discovery,
}: PluginEnvironment) {
  return await createRouter({
    logger,
    config,
    database: databaseClientFactory,
    discovery
  });
}
