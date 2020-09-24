/*
 * Copyright 2020 Spotify AB
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
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';

describe('KubernetesClientProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return pods, services', async () => {
    const clientMock: any = {
      listPodForAllNamespaces: jest.fn(),
      listServiceForAllNamespaces: jest.fn(),
    };

    const kubernetesClientProvider: any = {
      getCoreClientByClusterDetails: jest.fn(() => clientMock),
      getAppsClientByClusterDetails: jest.fn(() => clientMock),
    };

    const sut = new KubernetesClientBasedFetcher({
      kubernetesClientProvider,
      logger: getVoidLogger(),
    });

    clientMock.listPodForAllNamespaces.mockResolvedValueOnce({
      body: {
        items: [
          {
            metadata: {
              name: 'pod-name',
            },
          },
        ],
      },
    });

    clientMock.listServiceForAllNamespaces.mockResolvedValueOnce({
      body: {
        items: [
          {
            metadata: {
              name: 'service-name',
            },
          },
        ],
      },
    });

    const result = await sut.fetchObjectsByServiceId(
      'some-service',
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: undefined,
      },
      new Set(['pods', 'services']),
    );

    expect(result).toStrictEqual([
      {
        type: 'pods',
        resources: [
          {
            metadata: {
              name: 'pod-name',
            },
          },
        ],
      },
      {
        type: 'services',
        resources: [
          {
            metadata: {
              name: 'service-name',
            },
          },
        ],
      },
    ]);

    expect(clientMock.listPodForAllNamespaces.mock.calls.length).toBe(1);
    expect(clientMock.listServiceForAllNamespaces.mock.calls.length).toBe(1);

    expect(
      kubernetesClientProvider.getAppsClientByClusterDetails.mock.calls.length,
    ).toBe(2);
    expect(
      kubernetesClientProvider.getCoreClientByClusterDetails.mock.calls.length,
    ).toBe(2);
  });
});
