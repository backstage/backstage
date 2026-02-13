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
import { mockErrorHandler, mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import * as parser from 'uri-template';

import {
  catalogGraphApiSpec,
  GraphQueryRequest,
  GraphQueryResult,
} from '@backstage/plugin-catalog-graph-common';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { Entity } from '@backstage/catalog-model';
import {
  CATALOG_FILTER_EXISTS,
  type EntityFilterQuery,
} from '@backstage/catalog-client';

import { GraphModule } from './GraphModule';
import { DefaultGraphService, GraphService } from './services/GraphService';

const entities: Entity[] = [
  {
    apiVersion: 'v1',
    kind: 'c',
    metadata: {
      name: 'a',
      namespace: 'd',
    },
    relations: [
      {
        type: 'r1',
        targetRef: 'c:d/b',
      },
    ],
  },
  {
    apiVersion: 'v1',
    kind: 'c',
    metadata: {
      name: 'b',
      namespace: 'd',
    },
    relations: [
      {
        type: 'r2',
        targetRef: 'c:d/c',
      },
    ],
  },
  {
    apiVersion: 'v1',
    kind: 'c',
    metadata: {
      name: 'c',
      namespace: 'd',
    },
  },
];

describe('createRouter', () => {
  let app: express.Express;
  let graphService: GraphService;

  beforeEach(async () => {
    graphService = new DefaultGraphService({
      catalog: catalogServiceMock({
        entities,
      }),
      maxDepth: 10,
      limitEntities: 1000,
    });
    app = express();
    const graphModule = GraphModule.create({
      graphService,
      router: app,
      httpAuth: mockServices.httpAuth(),
    });
    graphModule.registerRoutes();
    app.use(mockErrorHandler());
  });

  // This is a copy from CatalogClient's implementation, to mimic the filter query
  function getFilterValue(filter: EntityFilterQuery = []) {
    const filters: string[] = [];
    for (const filterItem of [filter].flat()) {
      const filterParts: string[] = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (v === CATALOG_FILTER_EXISTS) {
            filterParts.push(key);
          } else if (typeof v === 'string') {
            filterParts.push(`${key}=${v}`);
          }
        }
      }

      if (filterParts.length) {
        filters.push(filterParts.join(','));
      }
    }
    return filters;
  }

  const getQueryParams = (params: GraphQueryRequest) => {
    return parser.parse(catalogGraphApiSpec.urlTemplate).expand({
      ...params,
      filter: getFilterValue(params.filter),
    });
  };

  it('should get a graph', async () => {
    const params: GraphQueryRequest = {
      rootEntityRefs: ['c:d/a'],
      maxDepth: 2,
      relations: ['r1', 'r2'],
      filter: [{ kind: 'c' }, { kind: 'g' }],
    };

    const url = getQueryParams(params);
    const response = await request(app).get(url);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      entities,
      cutoff: false,
    } satisfies GraphQueryResult);
  });

  it('should get a smaller graph', async () => {
    const params: GraphQueryRequest = {
      rootEntityRefs: ['c:d/a'],
      maxDepth: 1,
      relations: ['r1', 'r2'],
      filter: [{ kind: 'c' }, { kind: 'g' }],
    };

    const url = getQueryParams(params);
    const response = await request(app).get(url);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      entities: entities.slice(0, 2),
      cutoff: false,
    } satisfies GraphQueryResult);
  });
});
