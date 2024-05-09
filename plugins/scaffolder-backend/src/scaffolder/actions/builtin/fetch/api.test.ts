/*
 * Copyright 2024 The Backstage Authors
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

jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchContents: jest.fn() };
});

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import {
  ReadUrlResponseFactory,
  UrlReader,
  resolveSafeChildPath,
} from '@backstage/backend-common';
import { createFetchApiAction } from './api';
import { CatalogApi } from '@backstage/catalog-client';
import fs from 'fs-extra';
import { Readable } from 'stream';

describe('fetch:api', () => {
  const sampleOpenApiDefinition = JSON.stringify({
    openapi: '3.0.3',
    info: {
      title: 'Foo API',
      version: '1.0.0',
    },
    paths: {},
  });

  const sampleApi = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: {
      namespace: 'default',
      name: 'sampleApi',
    },
    spec: {
      type: 'openapi',
      lifecycle: 'experimental',
      owner: 'guest',
      definition: sampleOpenApiDefinition,
    },
  };

  const sampleApiFromUrl = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: {
      namespace: 'default',
      name: 'sampleApiFromUrl',
    },
    spec: {
      type: 'openapi',
      lifecycle: 'experimental',
      owner: 'guest',
      definition:
        '$text: https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/api-with-examples.json',
    },
  };

  const catalog: CatalogApi = {
    getEntities: jest.fn(),
    getEntitiesByRefs: jest.fn(),
    queryEntities: jest.fn(),
    getEntityAncestors: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityFacets: jest.fn(),
    getLocationById: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationByRef: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    validateEntity: jest.fn(),
    getEntityByRef: async (apiEntityRef: string) => {
      if (apiEntityRef === 'api:default/sampleApi') {
        return sampleApi;
      }

      if (apiEntityRef === 'api:default/sampleApiFromUrl') {
        return sampleApiFromUrl;
      }
      throw new Error('Entity not found');
    },
  };

  const reader: UrlReader = {
    readTree: jest.fn(),
    search: jest.fn(),
    readUrl: async (_: string) => {
      return ReadUrlResponseFactory.fromReadable(
        Readable.from(Buffer.from(sampleOpenApiDefinition, 'utf-8')),
        { etag: 'etag' },
      );
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {});

  const action = createFetchApiAction({ reader, catalog });
  const mockContext = createMockActionContext();

  it('should fetch api definition', async () => {
    const entity = await catalog.getEntityByRef('api:default/sampleApi');
    expect(entity).toBeDefined();

    await action.handler({
      ...mockContext,
      input: {
        apiEntityRef: 'api:default/sampleApi',
        targetPath: 'api.yaml',
      },
    });
    // Verify the the file has been created under mockContext.workspacePath
    expect(
      fs.existsSync(
        resolveSafeChildPath(mockContext.workspacePath, 'api.yaml'),
      ),
    ).toBe(true);
    // Verify the content of the file
    expect(
      fs.readFileSync(
        resolveSafeChildPath(mockContext.workspacePath, 'api.yaml'),
        'utf8',
      ),
    ).toBe(sampleOpenApiDefinition);
  });

  it('should fetch api definition from url', async () => {
    const entity = await catalog.getEntityByRef('api:default/sampleApiFromUrl');
    expect(entity).toBeDefined();

    await action.handler({
      ...mockContext,
      input: {
        apiEntityRef: 'api:default/sampleApiFromUrl',
        targetPath: 'api.yaml',
      },
    });
    // Verify the the file has been created under mockContext.workspacePath
    expect(
      fs.existsSync(
        resolveSafeChildPath(mockContext.workspacePath, 'api.yaml'),
      ),
    ).toBe(true);
    // Verify the content of the file
    expect(
      fs.readFileSync(
        resolveSafeChildPath(mockContext.workspacePath, 'api.yaml'),
        'utf8',
      ),
    ).toBe(sampleOpenApiDefinition);
  });
});
