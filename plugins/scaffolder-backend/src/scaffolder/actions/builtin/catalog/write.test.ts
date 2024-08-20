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

import fs from 'fs-extra';

jest.mock('fs-extra');

const fsMock = fs as jest.Mocked<typeof fs>;

import os from 'os';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ANNOTATION_ORIGIN_LOCATION } from '@backstage/catalog-model';
import { createCatalogWriteAction } from './write';
import { resolve as resolvePath } from 'path';
import * as yaml from 'yaml';

describe('catalog:write', () => {
  const action = createCatalogWriteAction();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockContext = createMockActionContext({
    workspacePath: os.tmpdir(),
  });

  it('should write the catalog-info.yml in the workspace', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'n',
        namespace: 'ns',
        annotations: {
          [ANNOTATION_ORIGIN_LOCATION]: 'url:https://example.com',
        },
      },
      spec: {},
    };

    await action.handler({
      ...mockContext,
      input: {
        entity,
      },
    });

    expect(fsMock.outputFile).toHaveBeenCalledTimes(1);
    expect(fsMock.outputFile).toHaveBeenCalledWith(
      resolvePath(mockContext.workspacePath, 'catalog-info.yaml'),
      yaml.stringify(entity),
    );
  });

  it('should support a custom filename', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'n',
        namespace: 'ns',
        annotations: {
          [ANNOTATION_ORIGIN_LOCATION]: 'url:https://example.com',
        },
      },
      spec: {},
    };

    await action.handler({
      ...mockContext,
      input: {
        filePath: 'some-dir/entity-info.yaml',
        entity,
      },
    });

    expect(fsMock.outputFile).toHaveBeenCalledTimes(1);
    expect(fsMock.outputFile).toHaveBeenCalledWith(
      resolvePath(mockContext.workspacePath, 'some-dir/entity-info.yaml'),
      yaml.stringify(entity),
    );
  });

  it('should add backstage.io/source-template if provided', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'n',
        namespace: 'ns',
        annotations: {},
      },
      spec: {},
    };

    await action.handler({
      ...mockContext,
      templateInfo: { entityRef: 'template:default/test-skeleton' },
      input: { entity },
    });

    const expectedEntity = JSON.parse(JSON.stringify(entity));
    expectedEntity.metadata.annotations = {
      'backstage.io/source-template': 'template:default/test-skeleton',
    };

    expect(fsMock.outputFile).toHaveBeenCalledTimes(1);
    expect(fsMock.outputFile).toHaveBeenCalledWith(
      resolvePath(mockContext.workspacePath, 'catalog-info.yaml'),
      yaml.stringify(expectedEntity),
    );
  });
});
