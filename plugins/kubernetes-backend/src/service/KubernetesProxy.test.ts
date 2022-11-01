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
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { Request } from 'express';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

  const buildClustersSupplierWithClusters = (
    clusters: ClusterDetails[],
  ): KubernetesClustersSupplier => ({
    getClusters: async () => {
      return clusters;
    },
  });

  beforeEach(() => {
    proxy = new KubernetesProxy(getVoidLogger());
  });

  it('should return a ERROR_NOT_FOUND if no clusters are found', async () => {
    proxy.clustersSupplier = buildClustersSupplierWithClusters([]);

    const req = buildMockRequest('test', 'api');
    const { res, next } = getMockRes();

    await expect(proxy.proxyRequestHandler(req, res, next)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should match the response code of the Kubernetes response', async () => {
    const clusters: ClusterDetails[] = [
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ];

    proxy.clustersSupplier = buildClustersSupplierWithClusters(clusters);

    const req = buildMockRequest('cluster1', 'api');
    const { res: response, next } = getMockRes();

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

    worker.use(
      rest.get(`${clusters[0].url}/${req.params.path}`, (_, res, ctx) =>
        res(ctx.status(299), ctx.body(JSON.stringify(apiResponse))),
      ),
    );

    await proxy.proxyRequestHandler(req, response, next);

    expect(response.status).toHaveBeenCalledWith(299);
    expect(response.json).toHaveBeenCalledWith(apiResponse);
  });

  it('should pass the exact response data from Kubernetes', async () => {
    const clusters: ClusterDetails[] = [
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ];

    proxy.clustersSupplier = buildClustersSupplierWithClusters(clusters);

    const req = buildMockRequest('cluster1', 'api');
    const { res: response, next } = getMockRes();

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

    worker.use(
      rest.get(`${clusters[0].url}/${req.params.path}`, (_, res, ctx) =>
        res(ctx.status(200), ctx.body(JSON.stringify(apiResponse))),
      ),
    );

    await proxy.proxyRequestHandler(req, response, next);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(apiResponse);
  });
});
