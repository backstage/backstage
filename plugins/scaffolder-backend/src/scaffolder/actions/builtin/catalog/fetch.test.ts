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
  const catalogClient = {
    getEntityByRef: getEntityByRef,
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

  it('should return null if entity not in catalog and optional is true', async () => {
    getEntityByRef.mockImplementationOnce(() => {
      throw new Error('Not found');
    });

    await action.handler({
      ...mockContext,
      input: {
        entityRef: 'component:default/test',
        optional: true,
      },
    });

    expect(getEntityByRef).toHaveBeenCalledWith('component:default/test', {
      token: 'secret',
    });
    expect(mockContext.output).toHaveBeenCalledWith('entity', null);
  });

  it('should throw error if entity not in catalog and optional is false', async () => {
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
});
