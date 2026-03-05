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

import { Entity } from '@backstage/catalog-model';
import { generateAuth } from './auth';

jest.mock('@backstage/core-plugin-api');

const entity = {
  metadata: {
    name: 'some-entity',
  },
} as Entity;

const entityWithAuthToken = {
  auth: {
    google: 'some-token',
  },
  entity,
};

const getClustersResponse = [
  {
    name: 'cluster-a',
    authProvider: 'google',
  },
  {
    name: 'cluster-b',
    authProvider: 'authprovider2',
  },
];

describe('generateAuth', () => {
  const mockGetClusters = jest.fn();
  const mockDecorateRequestBodyForAuth = jest.fn();

  const expectMocksCalledCorrectly = (numOfCalls: number = 1) => {
    expect(mockGetClusters).toHaveBeenCalledTimes(numOfCalls);
    expect(mockGetClusters).toHaveBeenLastCalledWith();
    expect(mockDecorateRequestBodyForAuth).toHaveBeenCalledTimes(
      numOfCalls * 2,
    );
    expect(mockDecorateRequestBodyForAuth).toHaveBeenCalledWith('google', {
      entity,
    });
    expect(mockDecorateRequestBodyForAuth).toHaveBeenCalledWith(
      'authprovider2',
      entityWithAuthToken,
    );
  };

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should return auth', async () => {
    const result = await generateAuth(
      entity,
      {
        getClusters: mockGetClusters.mockResolvedValue(getClustersResponse),
      } as any,
      {
        decorateRequestBodyForAuth:
          mockDecorateRequestBodyForAuth.mockResolvedValue(entityWithAuthToken),
      } as any,
    );

    expect(result).toStrictEqual({
      google: 'some-token',
    });
    expectMocksCalledCorrectly();
  });

  it('should return error when getClusters throws', async () => {
    await expect(
      generateAuth(
        entity,
        {
          getClusters: mockGetClusters.mockRejectedValue('some-cluster-error'),
        } as any,
        {
          decorateRequestBodyForAuth: mockDecorateRequestBodyForAuth,
        } as any,
      ),
    ).rejects.toBe('some-cluster-error');

    expect(mockGetClusters).toHaveBeenCalledTimes(1);
    expect(mockGetClusters).toHaveBeenLastCalledWith();
    expect(mockDecorateRequestBodyForAuth).toHaveBeenCalledTimes(0);
  });
  it('should return error when decorateRequestBodyForAuth throws', async () => {
    await expect(
      generateAuth(
        entity,
        {
          getClusters: mockGetClusters.mockResolvedValue(getClustersResponse),
        } as any,
        {
          decorateRequestBodyForAuth:
            mockDecorateRequestBodyForAuth.mockRejectedValue(
              'some-decorate-error',
            ),
        } as any,
      ),
    ).rejects.toBe('some-decorate-error');

    expect(mockGetClusters).toHaveBeenCalledTimes(1);
    expect(mockGetClusters).toHaveBeenLastCalledWith();
    expect(mockDecorateRequestBodyForAuth).toHaveBeenCalledTimes(1);
    expect(mockDecorateRequestBodyForAuth).toHaveBeenCalledWith('google', {
      entity,
    });
  });
});
