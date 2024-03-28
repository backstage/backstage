/*
 * Copyright 2023 The Backstage Authors
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
import { ServerTokenManager, getVoidLogger } from '@backstage/backend-common';

import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { getMatchingEntities } from './getMatchingEntities';

describe('getMatchingEntities', () => {
  const logger = getVoidLogger();
  const catalogClient: jest.Mocked<CatalogApi> = {
    getEntities: jest.fn(),
    getEntityByRef: jest.fn(),
  } as any;

  const tokenManager = ServerTokenManager.noop();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get entities matching provided project and repo', async () => {
    const matchingEntities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          namespace: 'default',
          annotations: {
            'backstage.io/techdocs-ref': 'https://github.com/project/repo',
          },
        },
      },
    ];

    catalogClient.getEntities.mockResolvedValue({ items: matchingEntities });

    const entities = await getMatchingEntities(
      tokenManager,
      catalogClient,
      logger,
      'project',
      'repo',
    );
    expect(catalogClient.getEntities).toHaveBeenCalled();
    expect(entities).toEqual(matchingEntities);
  });

  it('should return empty result when not matching provided project and repo', async () => {
    const matchingEntities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          namespace: 'default',
          annotations: {
            'backstage.io/techdocs-ref': 'https://github.com/not/matching',
          },
        },
      },
    ];

    catalogClient.getEntities.mockResolvedValue({ items: matchingEntities });

    const entities = await getMatchingEntities(
      tokenManager,
      catalogClient,
      logger,
      'project',
      'repo',
    );
    expect(catalogClient.getEntities).toHaveBeenCalled();
    expect(entities).toEqual([]);
  });

  it('should return empty results when no TechDocs annotation found', async () => {
    const matchingEntities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          namespace: 'default',
        },
      },
    ];

    catalogClient.getEntities.mockResolvedValue({ items: matchingEntities });

    const entities = await getMatchingEntities(
      tokenManager,
      catalogClient,
      logger,
      'project',
      'repo',
    );
    expect(catalogClient.getEntities).toHaveBeenCalled();
    expect(entities).toEqual([]);
  });

  it('should use source location when TechDocs annotation is "dir:."', async () => {
    const matchingEntities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          namespace: 'default',
          annotations: {
            'backstage.io/techdocs-ref': 'dir:.',
            'backstage.io/source-location': 'https://github.com/project/repo',
          },
        },
      },
    ];

    catalogClient.getEntities.mockResolvedValue({ items: matchingEntities });

    const entities = await getMatchingEntities(
      tokenManager,
      catalogClient,
      logger,
      'project',
      'repo',
    );
    expect(catalogClient.getEntities).toHaveBeenCalled();
    expect(entities).toEqual(matchingEntities);
  });

  it('should return empty results when when TechDocs annotation is "dir:." but there is no source location', async () => {
    const matchingEntities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          namespace: 'default',
          annotations: {
            'backstage.io/techdocs-ref': 'dir:.',
          },
        },
      },
    ];

    catalogClient.getEntities.mockResolvedValue({ items: matchingEntities });

    const entities = await getMatchingEntities(
      tokenManager,
      catalogClient,
      logger,
      'project',
      'repo',
    );
    expect(catalogClient.getEntities).toHaveBeenCalled();
    expect(entities).toEqual([]);
  });
});
