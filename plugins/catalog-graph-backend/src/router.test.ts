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

import { createRouter } from './router';
import { DefaultGraphService, GraphService } from './services/GraphService';
import {
  GraphQueryParams,
  GraphQueryResult,
} from '@backstage/plugin-catalog-graph-common';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { Entity } from '@backstage/catalog-model';

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

// TEMPLATE NOTE:
// Testing the router directly allows you to write a unit test that mocks the provided options.
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
    const router = await createRouter({
      httpAuth: mockServices.httpAuth(),
      graphService,
    });
    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  const appendParams = (
    urlSearchParams: URLSearchParams,
    params: GraphQueryParams,
  ) => {
    for (const ref of params.rootEntityRefs) {
      urlSearchParams.append('rootEntityRefs', ref);
    }
    if (params.maxDepth) {
      urlSearchParams.append('maxDepth', params.maxDepth.toString());
    }
    for (const rel of params.relations ?? []) {
      urlSearchParams.append('relations', rel);
    }
    for (const kind of params.kinds ?? []) {
      urlSearchParams.append('kinds', kind);
    }
  };

  it('should get a graph', async () => {
    const params: GraphQueryParams = {
      rootEntityRefs: ['c:d/a'],
      maxDepth: 2,
      relations: ['r1', 'r2'],
      kinds: ['c', 'g'],
    };

    const urlSearchParams = new URLSearchParams();
    appendParams(urlSearchParams, params);
    const response = await request(app).get(`/graph?${urlSearchParams}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      entities,
      cutoff: false,
    } satisfies GraphQueryResult);
  });

  it('should get a smaller graph', async () => {
    const params: GraphQueryParams = {
      rootEntityRefs: ['c:d/a'],
      maxDepth: 1,
      relations: ['r1', 'r2'],
      kinds: ['c', 'g'],
    };

    const urlSearchParams = new URLSearchParams();
    appendParams(urlSearchParams, params);
    const response = await request(app).get(`/graph?${urlSearchParams}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      entities: entities.slice(0, 2),
      cutoff: false,
    } satisfies GraphQueryResult);
  });
});
