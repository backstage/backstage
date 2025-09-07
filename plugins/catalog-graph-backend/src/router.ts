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

import express from 'express';
import Router from 'express-promise-router';

import { HttpAuthService } from '@backstage/backend-plugin-api';
import { GraphQueryParams } from '@backstage/plugin-catalog-graph-common';

import { GraphService } from './services/GraphService';

export async function createRouter({
  httpAuth,
  graphService,
}: {
  httpAuth: HttpAuthService;
  graphService: GraphService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  function ensureArray(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value];
  }

  function parseQueryParams(
    params: Record<string, string | string[]>,
  ): GraphQueryParams {
    const ret: GraphQueryParams = {
      rootEntityRefs: params.rootEntityRefs
        ? ensureArray(params.rootEntityRefs)
        : [],
      relations: params.relations ? ensureArray(params.relations) : undefined,
      kinds: params.kinds ? ensureArray(params.kinds) : undefined,
      maxDepth: params.maxDepth
        ? parseInt(params.maxDepth as string, 10)
        : undefined,
    };

    return ret;
  }

  // Get the catalog entities that fulfill a catalog graph query
  router.get('/graph', async (req, res) => {
    const query = parseQueryParams(
      req.query as Record<string, string | string[]>,
    );

    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const result = await graphService.fetchGraph(query, credentials);

    res.status(200).json(result);
  });

  return router;
}
