/*
 * Copyright 2022 The Backstage Authors
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

import { getVoidLogger, errorHandler } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import Router from 'express-promise-router';
import { addResourceRoutesToRouter } from './resourcesRoutes';
import querystring from 'node:querystring';
import { Entity } from '@backstage/catalog-model';

describe('resourcesRoutes', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    const router = Router();
    const logger = getVoidLogger();
    addResourceRoutesToRouter(
      router,
      {
        getEntityByRef: jest.fn().mockResolvedValue({
          kind: 'Component',
          metadata: {
            name: 'someComponent',
            namespace: 'someNamespace',
          },
        } as Entity),
      } as any,
      {
        getKubernetesObjectsByEntity: jest.fn().mockResolvedValue({
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        }),
        getCustomResourcesByEntity: jest.fn().mockResolvedValue({
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        }),
      } as any,
      logger,
    );
    app.use('/', router);
    app.use(errorHandler());
  });

  describe('POST /resources/workloads/query', () => {
    // eslint-disable-next-line jest/expect-expect
    it('200 happy path', async () => {
      await request(app)
        .post(
          `/resources/workloads/query?${querystring.stringify({
            entity: 'component:someComponent',
          })}`,
        )
        .send({
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer Zm9vYmFy')
        .expect(200, {
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        });
    });
    it('401 when no Auth header', async () => {
      await request(app)
        .post(
          `/resources/workloads/query?${querystring.stringify({
            entity: 'component:someComponent',
          })}`,
        )
        .send({
          auth: {
            google: 'something',
          },
        })
        .set('Content-Type', 'application/json')
        .expect(401, {
          error: { name: 'AuthenticationError', message: 'No Backstage token' },
      request: {
        method: 'POST',
        url: '/resources/workloads/query?entity=component%3AsomeComponent'
      },
      response: { statusCode: 401 }
        });
    });
  });
  describe('POST /resources/custom/query', () => {
    it('200 happy path', async () => {
      await request(app)
        .post(
          `/resources/custom/query?${querystring.stringify({
            entity: 'component:someComponent',
          })}`,
        )
        .send({
          auth: {
            google: 'something',
          },
          customResources: [{
            group: "someGroup",
            apiVersion: "someApiVersion",
            plural: "somePlural",
          }]
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer Zm9vYmFy')
        .expect(200, {
          items: [
            {
              clusterOne: {
                pods: [
                  {
                    metadata: {
                      name: 'pod1',
                    },
                  },
                ],
              },
            },
          ],
        });
    });
  });
});
