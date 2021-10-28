import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

// TODO(authorization-framework): we should centralize this
// StubPermissionClient so that backends can make authorize
// calls whether or not authorization is enabled.
class StubPermissionClient {
  async authorize(requests: any[]): Promise<{ result: 'ALLOW' | 'DENY' }[]> {
    return requests.map(() => ({ result: 'ALLOW' }));
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create({
    ...env,
    permissions: new StubPermissionClient() as any,
  });
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
