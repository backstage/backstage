// @ts-ignore
import { createRouter } from '@backstage/plugin-proxy-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  { logger, config }: PluginEnvironment,
  pathPrefix: string,
) {
  return await createRouter({ logger, config, pathPrefix });
}
