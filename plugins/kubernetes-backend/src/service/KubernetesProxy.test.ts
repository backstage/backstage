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

import { getVoidLogger } from '@backstage/backend-common';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  KubernetesProxyServices,
} from '../types/types';
import { KubernetesProxy } from './KubernetesProxy';

import { Request } from 'express';

import 'buffer';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

import fetch from 'node-fetch';

describe('KubernetesProxy', () => {
  let _clientMock: any;
  let sut: KubernetesProxy;

  const buildEncodedRequest = (
    clustersHeader: any,
    query: string,
    body?: any,
  ): Request => {
    const encodedQuery = encodeURIComponent(query);
    const encodedClusters = Buffer.from(
      JSON.stringify(clustersHeader),
    ).toString('base64');

    const req = {
      params: {
        encodedQuery,
      },
      header: (key: string) => {
        let value: string = '';
        switch (key) {
          case 'Content-Type': {
            value = 'application/json';
            break;
          }
          case 'X-Kubernetes-Clusters': {
            value = encodedClusters;
            break;
          }
          default: {
            break;
          }
        }
        return value;
      },
    } as unknown as Request;

    if (body) {
      req.body = body;
    }

    return req;
  };

  const buildProxyServicesWithClusters = (
    clusters: ClusterDetails[],
  ): KubernetesProxyServices => {
    const kcs: KubernetesClustersSupplier = {
      getClusters: async () => {
        return clusters;
      },
    };

    return {
      kcs,
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
    _clientMock = {
      handleProxyRequest: jest.fn(),
    };

    sut = new KubernetesProxy(getVoidLogger());
  });

  it('should return a 404 if no clusters are found', async () => {
    const services = buildProxyServicesWithClusters([]);
    const req = buildEncodedRequest({}, 'api');

    const result = await sut.handleProxyRequest(services, req);

    expect(result.code).toEqual(404);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should match the response code of the Kubernetes response (single cluster)', async () => {
    const services = buildProxyServicesWithClusters([
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ]);
    const req = buildEncodedRequest({ cluster1: 'token' }, 'api');

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

    // @ts-ignore-next-line
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify(apiResponse), {
        status: 299,
      }),
    );

    const result = await sut.handleProxyRequest(services, req);

    expect(fetch).toBeCalledTimes(1);
    expect(result.code).toEqual(299);
  });

  it('should match the response code of the best Kubernetes response (multi cluster)', async () => {
    const services = buildProxyServicesWithClusters([
      {
        name: 'cluster1',
        url: 'http://localhost:9998',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ]);
    const req = buildEncodedRequest(
      { cluster1: 'token', cluster2: 'token' },
      'api',
    );

    const apiResponse1 = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    const apiResponse2 = {
      kind: 'Status',
      apiVersion: 'v1',
      metadata: {},
      status: 'Failure',
      message: 'Unauthorized',
      reason: 'Unauthorized',
      code: 401,
    };

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(apiResponse1), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(apiResponse2), {
          status: 401,
        }),
      );

    const result = await sut.handleProxyRequest(services, req);

    expect(fetch).toBeCalledTimes(2);
    expect(result.code).toEqual(200);
  });

  it('should pass the exact response data from Kubernetes (single cluster)', async () => {
    const services = buildProxyServicesWithClusters([
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ]);
    const req = buildEncodedRequest({ cluster1: 'token' }, 'api');

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

    // @ts-ignore-next-line
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify(apiResponse), {
        status: 200,
      }),
    );

    const result = await sut.handleProxyRequest(services, req);

    const resultString = JSON.stringify(result.data);
    const expectedString = JSON.stringify({
      cluster1: {
        kind: 'APIVersions',
        versions: ['v1'],
        serverAddressByClientCIDRs: [
          {
            clientCIDR: '0.0.0.0/0',
            serverAddress: '192.168.0.1:3333',
          },
        ],
      },
    });

    expect(fetch).toBeCalledTimes(1);
    expect(resultString).toEqual(expectedString);
  });

  it('should pass the exact response data from Kubernetes (multi cluster)', async () => {
    const services = buildProxyServicesWithClusters([
      {
        name: 'cluster1',
        url: 'http://localhost:9998',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
        skipTLSVerify: true,
      },
    ]);
    const req = buildEncodedRequest(
      { cluster1: 'token', cluster2: 'token' },
      'api',
    );

    const apiResponse1 = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    const apiResponse2 = {
      kind: 'Status',
      apiVersion: 'v1',
      metadata: {},
      status: 'Failure',
      message: 'Unauthorized',
      reason: 'Unauthorized',
      code: 401,
    };

    // @ts-ignore-next-line
    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(apiResponse1), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(apiResponse2), {
          status: 401,
        }),
      );

    const result = await sut.handleProxyRequest(services, req);

    const resultString = JSON.stringify(result.data);
    const expectedString = JSON.stringify({
      cluster1: {
        kind: 'APIVersions',
        versions: ['v1'],
        serverAddressByClientCIDRs: [
          {
            clientCIDR: '0.0.0.0/0',
            serverAddress: '192.168.0.1:3333',
          },
        ],
      },
      cluster2: {
        kind: 'Status',
        apiVersion: 'v1',
        metadata: {},
        status: 'Failure',
        message: 'Unauthorized',
        reason: 'Unauthorized',
        code: 401,
      },
    });

    expect(fetch).toBeCalledTimes(2);
    expect(resultString).toEqual(expectedString);
  });
});
