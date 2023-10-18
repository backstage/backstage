/*
 * Copyright 2021 The Backstage Authors
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

import { useCustomResources } from './useCustomResources';
import { Entity } from '@backstage/catalog-model';
import { renderHook } from '@testing-library/react-hooks';
import { useApi } from '@backstage/core-plugin-api';
import { CustomResourceMatcher } from '@backstage/plugin-kubernetes-common';
import { generateAuth } from './auth';

jest.mock('@backstage/core-plugin-api');

const entity = {
  metadata: {
    name: 'some-entity',
  },
} as Entity;

const customResourceMatchers: CustomResourceMatcher[] = [
  {
    group: 'myGroup',
    apiVersion: 'v1',
    plural: 'thing',
  },
];

const entityWithAuthToken = {
  auth: {
    google: 'some-token',
  },
  customResources: customResourceMatchers,
  entity,
};

const mockResponse = {
  items: [
    {
      cluster: { name: 'some-cluster' },
      resources: [
        {
          type: 'pods',
          resources: [
            {
              metadata: {
                name: 'some-pod',
              },
            },
          ],
        },
      ],
      errors: [],
    },
  ],
};

jest.mock('./auth', () => {
  return {
    ...jest.requireActual('./auth'),
    generateAuth: jest.fn(),
  };
});

describe('useCustomResources', () => {
  const mockGetCustomObjectsByEntity = jest.fn();
  const mockGenerateAuth = generateAuth as jest.Mock;

  const expectMocksCalledCorrectly = (numOfCalls: number = 1) => {
    expect(mockGenerateAuth).toHaveBeenCalledTimes(numOfCalls);
    expect(mockGenerateAuth.mock.calls[numOfCalls - 1][0]).toStrictEqual(
      entity,
    );
    expect(mockGetCustomObjectsByEntity).toHaveBeenCalledTimes(numOfCalls);
    expect(mockGetCustomObjectsByEntity).toHaveBeenLastCalledWith(
      entityWithAuthToken,
    );
  };

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should return objects', async () => {
    mockGenerateAuth.mockResolvedValue(entityWithAuthToken.auth);
    (useApi as any).mockReturnValue({
      getCustomObjectsByEntity:
        mockGetCustomObjectsByEntity.mockResolvedValue(mockResponse),
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useCustomResources(entity, customResourceMatchers),
    );

    expect(result.current.loading).toEqual(true);

    await waitForNextUpdate();

    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toEqual(false);
    expect(result.current.kubernetesObjects).toStrictEqual(mockResponse);

    expectMocksCalledCorrectly();
  });
  it('should update on an interval', async () => {
    mockGenerateAuth.mockResolvedValue(entityWithAuthToken.auth);
    (useApi as any).mockReturnValue({
      getCustomObjectsByEntity:
        mockGetCustomObjectsByEntity.mockResolvedValue(mockResponse),
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useCustomResources(entity, customResourceMatchers, 100),
    );

    await waitForNextUpdate();
    expect(result.current.error).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toEqual(false);
    expect(result.current.kubernetesObjects).toStrictEqual(mockResponse);

    expectMocksCalledCorrectly(2);
  });
  it('should return error when getObjectsByEntity throws', async () => {
    mockGenerateAuth.mockResolvedValue(entityWithAuthToken.auth);
    (useApi as any).mockReturnValue({
      getCustomObjectsByEntity: mockGetCustomObjectsByEntity.mockRejectedValue({
        message: 'some error',
      }),
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useCustomResources(entity, customResourceMatchers),
    );

    await waitForNextUpdate();

    expect(result.current.error).toBe('some error');
    expect(result.current.loading).toEqual(false);
    expect(result.current.kubernetesObjects).toBeUndefined();

    expectMocksCalledCorrectly();
  });

  describe('when retrying', () => {
    it('should reset error after generateAuth has failed and then succeeded', async () => {
      (useApi as any).mockReturnValue({
        generateAuth: mockGenerateAuth
          .mockRejectedValueOnce({ message: 'generateAuth failed' })
          .mockResolvedValue(entityWithAuthToken.auth),
        getCustomObjectsByEntity:
          mockGetCustomObjectsByEntity.mockResolvedValue(mockResponse),
      });

      const { result, waitForNextUpdate } = renderHook(() =>
        useCustomResources(entity, customResourceMatchers, 100),
      );

      await waitForNextUpdate();

      expect(result.current.error).toBe('generateAuth failed');
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).toBeUndefined();

      await waitForNextUpdate();

      expect(result.current.error).toBeUndefined();
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).not.toBeUndefined();
    });

    it('should reset error after getCustomObjectsByEntity has failed and then succeeded', async () => {
      (useApi as any).mockReturnValue({
        getCustomObjectsByEntity: mockGetCustomObjectsByEntity
          .mockRejectedValueOnce({ message: 'failed to fetch' })
          .mockResolvedValue(mockResponse),
      });

      const { result, waitForNextUpdate } = renderHook(() =>
        useCustomResources(entity, customResourceMatchers, 100),
      );

      await waitForNextUpdate();

      expect(result.current.error).toBe('failed to fetch');
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).toBeUndefined();

      await waitForNextUpdate();

      expect(result.current.error).toBeUndefined();
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).not.toBeUndefined();
    });

    it('should reset data after generateAuth succeeded then failed', async () => {
      (useApi as any).mockReturnValue({
        generateAuth: mockGenerateAuth
          .mockResolvedValueOnce(entityWithAuthToken.auth)
          .mockRejectedValue({ message: 'generateAuth failed' }),
        getCustomObjectsByEntity:
          mockGetCustomObjectsByEntity.mockResolvedValue(mockResponse),
      });

      const { result, waitForNextUpdate } = renderHook(() =>
        useCustomResources(entity, customResourceMatchers, 100),
      );

      await waitForNextUpdate();

      expect(result.current.error).toBeUndefined();
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).not.toBeUndefined();

      await waitForNextUpdate();

      expect(result.current.error).toBe('generateAuth failed');
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).toBeUndefined();
    });

    it('should reset data after getCustomObjectsByEntity succeeded then failed', async () => {
      (useApi as any).mockReturnValue({
        getCustomObjectsByEntity: mockGetCustomObjectsByEntity
          .mockResolvedValueOnce(mockResponse)
          .mockRejectedValue({ message: 'failed to fetch' }),
      });

      const { result, waitForNextUpdate } = renderHook(() =>
        useCustomResources(entity, customResourceMatchers, 100),
      );

      await waitForNextUpdate();

      expect(result.current.error).toBeUndefined();
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).not.toBeUndefined();

      await waitForNextUpdate();

      expect(result.current.error).toBe('failed to fetch');
      expect(result.current.loading).toEqual(false);
      expect(result.current.kubernetesObjects).toBeUndefined();
    });
  });
});
