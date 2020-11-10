import { createRouter } from '@backstage/plugin-slack-unfurl-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  discovery,
}: PluginEnvironment) {
  return await createRouter({ logger, config, discovery });
}
