/*
 * Copyright 2020 The Backstage Authors
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

import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';
import { DirectoryPreparer } from './dir';
import { mockServices } from '@backstage/backend-test-utils';

function normalizePath(path: string) {
  return path
    .replace(/^[a-z]:/i, '')
    .split('\\')
    .join('/');
}

jest.mock('../../helpers', () => ({
  ...jest.requireActual<{}>('../../helpers'),
}));

const logger = mockServices.logger.mock();

const createMockEntity = (annotations: {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'testName',
      annotations: {
        ...annotations,
      },
    },
  };
};

const mockConfig = mockServices.rootConfig();
const mockUrlReader = mockServices.urlReader.mock();

describe('directory preparer', () => {
  it('should merge managed-by-location and techdocs-ref when techdocs-ref is relative', async () => {
    const directoryPreparer = DirectoryPreparer.fromConfig(mockConfig, {
      logger,
      reader: mockUrlReader,
    });

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      [TECHDOCS_ANNOTATION]: 'dir:./our-documentation',
    });

    const { preparedDir } = await directoryPreparer.prepare(mockEntity);
    expect(normalizePath(preparedDir)).toEqual('/directory/our-documentation');
  });

  it('should reject when techdocs-ref is absolute', async () => {
    const directoryPreparer = DirectoryPreparer.fromConfig(mockConfig, {
      logger,
      reader: mockUrlReader,
    });

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      [TECHDOCS_ANNOTATION]: 'dir:/our-documentation/techdocs',
    });

    await expect(directoryPreparer.prepare(mockEntity)).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should reject when managed-by-location has an unknown type', async () => {
    const directoryPreparer = DirectoryPreparer.fromConfig(mockConfig, {
      logger,
      reader: mockUrlReader,
    });

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'does-not-exist:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      [TECHDOCS_ANNOTATION]: 'dir:./docs',
    });

    await expect(directoryPreparer.prepare(mockEntity)).rejects.toThrow(
      /Unable to resolve location type does-not-exist/,
    );
  });
});
