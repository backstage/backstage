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

import { handleGetKubernetesObjectsByServiceId } from './getKubernetesObjectsByServiceIdHandler';
import { getVoidLogger } from '@backstage/backend-common';
import { ClusterDetails } from '..';

const TEST_SERVICE_ID = 'my-service';

const fetchObjectsByServiceId = jest.fn();

const getClusterByServiceId = jest.fn();

const mockFetch = (mock: jest.Mock) => {
  mock.mockImplementation((serviceId: string, clusterDetails: ClusterDetails) =>
    Promise.resolve({
      errors: [],
      responses: [
        {
          type: 'pods',
          resources: [
            {
              metadata: {
                name: `my-pods-${serviceId}-${clusterDetails.name}`,
              },
            },
          ],
        },
        {
          type: 'configmaps',
          resources: [
            {
              metadata: {
                name: `my-configmaps-${serviceId}-${clusterDetails.name}`,
              },
            },
          ],
        },
        {
          type: 'services',
          resources: [
            {
              metadata: {
                name: `my-services-${serviceId}-${clusterDetails.name}`,
              },
            },
          ],
        },
      ],
    }),
  );
};

describe('handleGetKubernetesObjectsByServiceId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('retrieve objects for one cluster', async () => {
    getClusterByServiceId.mockImplementation(() =>
      Promise.resolve([
        {
          name: 'test-cluster',
        },
      ]),
    );

    mockFetch(fetchObjectsByServiceId);

    const result = await handleGetKubernetesObjectsByServiceId(
      TEST_SERVICE_ID,
      {
        fetchObjectsByServiceId,
      },
      {
        getClusterByServiceId,
      },
      getVoidLogger(),
    );

    expect(getClusterByServiceId.mock.calls.length).toBe(1);
    expect(fetchObjectsByServiceId.mock.calls.length).toBe(1);
    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            name: 'test-cluster',
          },
          errors: [],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-my-service-test-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-my-service-test-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-my-service-test-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
      ],
    });
  });

  it('retrieve objects for two clusters', async () => {
    getClusterByServiceId.mockImplementation(() =>
      Promise.resolve([
        {
          name: 'test-cluster',
        },
        {
          name: 'other-cluster',
        },
      ]),
    );

    mockFetch(fetchObjectsByServiceId);

    const result = await handleGetKubernetesObjectsByServiceId(
      TEST_SERVICE_ID,
      {
        fetchObjectsByServiceId,
      },
      {
        getClusterByServiceId,
      },
      getVoidLogger(),
    );

    expect(getClusterByServiceId.mock.calls.length).toBe(1);
    expect(fetchObjectsByServiceId.mock.calls.length).toBe(2);
    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            name: 'test-cluster',
          },
          errors: [],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-my-service-test-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-my-service-test-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-my-service-test-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-my-service-other-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-my-service-other-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-my-service-other-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
      ],
    });
  });
});
