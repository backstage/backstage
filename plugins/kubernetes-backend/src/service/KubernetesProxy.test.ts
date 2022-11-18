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

import 'buffer';
import { getVoidLogger } from '@backstage/backend-common';
import { NotFoundError } from '@backstage/errors';
import { getMockReq, getMockRes } from '@jest-mock/express';
import type { Request } from 'express';
import express from 'express';
import request from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import {
  APPLICATION_JSON,
  HEADER_KUBERNETES_CLUSTER,
  KubernetesProxy,
} from './KubernetesProxy';

describe('KubernetesProxy', () => {
  let proxy: KubernetesProxy;
  const worker = setupServer();

  setupRequestMockHandlers(worker);

  const buildMockRequest = (clusterName: any, path: string): Request => {
    const req = getMockReq({
      params: {
        path,
      },
      header: jest.fn((key: string) => {
        switch (key) {
          case 'Content-Type': {
            return APPLICATION_JSON;
          }
          case HEADER_KUBERNETES_CLUSTER: {
            return clusterName;
          }
          default: {
            return '';
          }
        }
      }),
    });

    return req;
  };

  const clusterSupplier: jest.Mocked<KubernetesClustersSupplier> = {
    getClusters: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    proxy = new KubernetesProxy(getVoidLogger(), clusterSupplier);
  });

  it('should return a ERROR_NOT_FOUND if no clusters are found', async () => {
    clusterSupplier.getClusters.mockResolvedValue([]);

    const req = buildMockRequest('test', 'api');
    const { res, next } = getMockRes();

    await expect(proxy.createRequestHandler()(req, res, next)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should pass the exact response from Kubernetes', async () => {
    const apiResponse = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        serviceAccountToken: '',
        authProvider: 'serviceAccount',
      },
    ] as ClusterDetails[]);
    const app = express().use('/mountpath', proxy.createRequestHandler());
    const requestPromise = request(app)
      .get('/mountpath/api')
      .set(HEADER_KUBERNETES_CLUSTER, 'cluster1');
    worker.use(
      rest.get('https://localhost:9999/api', (_, res, ctx) =>
        res(ctx.status(299), ctx.json(apiResponse)),
      ),
      rest.all(requestPromise.url, (req, _res, _ctx) => req.passthrough()),
    );

    const response = await requestPromise;

    expect(response.status).toEqual(299);
    expect(response.body).toStrictEqual(apiResponse);
  });
});
