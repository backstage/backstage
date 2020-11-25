import { createRouter } from '@backstage/plugin-app-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  return await createRouter({
    logger,
    config,
    appPackageName: 'app',
  });
}
