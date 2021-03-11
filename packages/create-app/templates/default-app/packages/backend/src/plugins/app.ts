import { createRouter } from '@backstage/plugin-app-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    config,
    appPackageName: 'app',
  });
}
