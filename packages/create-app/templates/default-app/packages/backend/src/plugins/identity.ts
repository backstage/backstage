import { createRouter } from '@backstage/plugin-identity-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  return await createRouter({ logger });
}
