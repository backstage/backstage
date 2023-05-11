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

import { PassThrough } from 'stream';
import os from 'os';
import { getVoidLogger } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { createFetchCatalogEntityAction } from './fetch';

describe('catalog:fetch', () => {
  const getEntityByRef = jest.fn();
  const getEntitiesByRefs = jest.fn();

  const catalogClient = {
    getEntityByRef: getEntityByRef,
    getEntitiesByRefs: getEntitiesByRefs,
  };

  const action = createFetchCatalogEntityAction({
    catalogClient: catalogClient as unknown as CatalogApi,
  });

  const mockContext = {
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
    secrets: { backstageToken: 'secret' },
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return entity from catalog', async () => {
    getEntityByRef.mockReturnValueOnce({
      metadata: {
        namespace: 'default',
        name: 'test',
      },
      kind: 'Component',
    } as Entity);

    await action.handler({
      ...mockContext,
      input: {
        entityRef: 'component:default/test',
      },
    });

    expect(getEntityByRef).toHaveBeenCalledWith('component:default/test', {
      token: 'secret',
    });
    expect(mockContext.output).toHaveBeenCalledWith('entity', {
      metadata: {
        namespace: 'default',
        name: 'test',
      },
      kind: 'Component',
    });
  });

  it('should throw error if entity fetch fails from catalog and optional is false', async () => {
    getEntityByRef.mockImplementationOnce(() => {
      throw new Error('Not found');
    });

    await expect(
      action.handler({
        ...mockContext,
        input: {
          entityRef: 'component:default/test',
        },
      }),
    ).rejects.toThrow('Not found');

    expect(getEntityByRef).toHaveBeenCalledWith('component:default/test', {
      token: 'secret',
    });
    expect(mockContext.output).not.toHaveBeenCalled();
  });

  it('should throw error if entity not in catalog and optional is false', async () => {
    getEntityByRef.mockReturnValueOnce(null);

    await expect(
      action.handler({
        ...mockContext,
        input: {
          entityRef: 'component:default/test',
        },
      }),
    ).rejects.toThrow('Entity component:default/test not found');

    expect(getEntityByRef).toHaveBeenCalledWith('component:default/test', {
      token: 'secret',
    });
    expect(mockContext.output).not.toHaveBeenCalled();
  });

  it('should return entities from catalog', async () => {
    getEntitiesByRefs.mockReturnValueOnce({
      items: [
        {
          metadata: {
            namespace: 'default',
            name: 'test',
          },
          kind: 'Component',
        } as Entity,
      ],
    });

    await action.handler({
      ...mockContext,
      input: {
        entityRefs: ['component:default/test'],
      },
    });

    expect(getEntitiesByRefs).toHaveBeenCalledWith(
      { entityRefs: ['component:default/test'] },
      {
        token: 'secret',
      },
    );
    expect(mockContext.output).toHaveBeenCalledWith('entities', [
      {
        metadata: {
          namespace: 'default',
          name: 'test',
        },
        kind: 'Component',
      },
    ]);
  });

  it('should throw error if undefined is returned for some entity', async () => {
    getEntitiesByRefs.mockReturnValueOnce({
      items: [
        {
          metadata: {
            namespace: 'default',
            name: 'test',
          },
          kind: 'Component',
        } as Entity,
        undefined,
      ],
    });

    await expect(
      action.handler({
        ...mockContext,
        input: {
          entityRefs: ['component:default/test', 'component:default/test2'],
          optional: false,
        },
      }),
    ).rejects.toThrow('Entity component:default/test2 not found');

    expect(getEntitiesByRefs).toHaveBeenCalledWith(
      { entityRefs: ['component:default/test', 'component:default/test2'] },
      {
        token: 'secret',
      },
    );
    expect(mockContext.output).not.toHaveBeenCalled();
  });

  it('should return null in case some of the entities not found and optional is true', async () => {
    getEntitiesByRefs.mockReturnValueOnce({
      items: [
        {
          metadata: {
            namespace: 'default',
            name: 'test',
          },
          kind: 'Component',
        } as Entity,
        undefined,
      ],
    });

    await action.handler({
      ...mockContext,
      input: {
        entityRefs: ['component:default/test', 'component:default/test2'],
        optional: true,
      },
    });

    expect(getEntitiesByRefs).toHaveBeenCalledWith(
      { entityRefs: ['component:default/test', 'component:default/test2'] },
      {
        token: 'secret',
      },
    );
    expect(mockContext.output).toHaveBeenCalledWith('entities', [
      {
        metadata: {
          namespace: 'default',
          name: 'test',
        },
        kind: 'Component',
      },
      null,
    ]);
  });
});
