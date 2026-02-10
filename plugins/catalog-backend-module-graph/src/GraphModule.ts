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

import {
  HttpAuthService,
  HttpRouterService,
} from '@backstage/backend-plugin-api';
import {
  catalogGraphApiSpec,
  GraphQueryRequest,
} from '@backstage/plugin-catalog-graph-common';
import {
  CATALOG_FILTER_EXISTS,
  type EntityFilterQuery,
} from '@backstage/catalog-client';

import Router from 'express-promise-router';
import uriTemplates from 'uri-templates';

import { ensureArray } from './lib/array';
import { GraphService } from './services/GraphService';

export class GraphModule {
  private readonly moduleRouter;
  private readonly httpAuth;
  private readonly graphService;

  private constructor(
    graphService: GraphService,
    router: Pick<HttpRouterService, 'use'>,
    httpAuth: HttpAuthService,
  ) {
    this.graphService = graphService;
    this.httpAuth = httpAuth;
    this.moduleRouter = Router();
    router.use(this.moduleRouter);
  }

  static create(options: {
    graphService: GraphService;
    router: Pick<HttpRouterService, 'use'>;
    httpAuth: HttpAuthService;
  }): GraphModule {
    return new GraphModule(
      options.graphService,
      options.router,
      options.httpAuth,
    );
  }

  registerRoutes() {
    // Get the catalog entities that fulfill a catalog graph query
    this.moduleRouter.get('/graph/by-query', async (req, res) => {
      const credentials = await this.httpAuth.credentials(req);

      const request = parseQueryRequest(req.url);

      const result = await this.graphService.fetchGraph(request, credentials);

      res.status(200).json(result);
    });
  }
}

function parseNumber(value: string): number | undefined {
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
}

function parseQueryRequest(url: string): GraphQueryRequest {
  const parsed =
    uriTemplates(catalogGraphApiSpec.urlTemplate).fromUri(url) ?? {};

  const rootEntityRefs = ensureArray(parsed.rootEntityRefs ?? []);
  const maxDepth = parsed.maxDepth ? parseNumber(parsed.maxDepth) : undefined;
  const relations = parsed.relations
    ? ensureArray(parsed.relations)
    : undefined;
  const fields = parsed.fields ? ensureArray(parsed.fields) : undefined;
  const rawFilter = parsed.filter ? ensureArray(parsed.filter) : undefined;

  const filter = rawFilter?.map((filt): Exclude<EntityFilterQuery, any[]> => {
    const parts = filt.split(',');
    const map = new Map<string, (string | symbol)[]>();

    for (const part of parts) {
      const [key, value] = part.split('=');

      const values = map.get(key) ?? [];
      values.push(typeof value === 'undefined' ? CATALOG_FILTER_EXISTS : value);
      map.set(key, values);
    }

    return Object.fromEntries(map.entries());
  });

  return { rootEntityRefs, maxDepth, relations, fields, filter };
}
