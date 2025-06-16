/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Router } from 'express';
import {
  AuthService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { createOpenApiRouter } from './schema/openapi';
import { BuildsProvider } from './extensionPoints';

export interface RouterOptions {
  config: RootConfigService;
  logger: LoggerService;
  auth: AuthService;
  catalog: CatalogService;
  providers: BuildsProvider[];
}

// TODO: Add logging
export async function createRouter(options: RouterOptions): Promise<Router> {
  const { logger, auth, catalog, providers } = options;

  const router = await createOpenApiRouter();

  router.get('/', async (req, res) => {
    const entityRef: string = req.query.entityRef as string;
    const entity = await catalog.getEntityByRef(entityRef, {
      credentials: await auth.getOwnServiceCredentials(),
    });
    if (!entity) {
      throw new Error(`Entity ${entityRef} not found.`);
    }
    const provider = providers.find(p => p.isProviderForEntity(entity));
    if (!provider) {
      throw new Error(`No builds provider found for entity ${entityRef}.`);
    }
    logger.info(
      `Listing builds for entity ${entityRef} using provider ${provider.id}`,
    );
    // TODO: Implement pagination and filtering
    const builds = await provider.getEntityBuilds(entity);
    res.json(builds);
  });

  router.get('/:buildId', async (req, res) => {
    const { buildId } = req.params;
    const entityRef: string = req.query.entityRef as string;
    const entity = await catalog.getEntityByRef(entityRef, {
      credentials: await auth.getOwnServiceCredentials(),
    });
    if (!entity) {
      throw new Error(`Entity ${entityRef} not found.`);
    }
    const provider = providers.find(p => p.isProviderForEntity(entity));
    if (!provider) {
      throw new Error(`No builds provider found for entity ${entityRef}.`);
    }
    logger.info(
      `Getting build details for ${entityRef}/${buildId} using provider ${provider.id}`,
    );
    const build = await provider.getEntityBuildDetails(entity, buildId);
    res.json(build);
  });

  router.post('/:buildId/retrigger', async (req, res) => {
    const { buildId } = req.params;
    const entityRef: string = req.query.entityRef as string;
    const entity = await catalog.getEntityByRef(entityRef, {
      credentials: await auth.getOwnServiceCredentials(),
    });
    if (!entity) {
      throw new Error(`Entity ${entityRef} not found.`);
    }
    const provider = providers.find(p => p.isProviderForEntity(entity));
    if (!provider) {
      throw new Error(`No builds provider found for entity ${entityRef}.`);
    }
    logger.info(
      `Retriggering build ${entityRef}/${buildId} using provider ${provider.id}`,
    );
    const build = await provider.retriggerEntityBuild(entity, buildId);
    res.status(202).json(build); // 202 Accepted, as retriggering might take time
  });

  router.get('/:buildId/logs', async (req, res) => {
    const { buildId } = req.params;
    const entityRef: string = req.query.entityRef as string;
    const entity = await catalog.getEntityByRef(entityRef, {
      credentials: await auth.getOwnServiceCredentials(),
    });
    if (!entity) {
      throw new Error(`Entity ${entityRef} not found.`);
    }
    const provider = providers.find(p => p.isProviderForEntity(entity));
    if (!provider) {
      throw new Error(`No builds provider found for entity ${entityRef}.`);
    }
    logger.info(
      `Streaming logs for build ${entityRef}/${buildId} using provider ${provider.id}`,
    );
    const logs = await provider.getEntityBuildLogs(entity, buildId);
    res.json(logs);
  });

  return router;
}
