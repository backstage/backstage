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
import { DirectoryPreparer } from './dir';
import { getVoidLogger } from '@backstage/backend-common';
import { checkoutGitRepository } from '../../helpers';

function normalizePath(path: string) {
  return path
    .replace(/^[a-z]:/i, '')
    .split('\\')
    .join('/');
}

jest.mock('../../helpers', () => ({
  ...jest.requireActual<{}>('../../helpers'),
  checkoutGitRepository: jest.fn(() => '/tmp/backstage-repo/org/name/branch/'),
}));

const logger = getVoidLogger();

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

describe('directory preparer', () => {
  it('should merge managed-by-location and techdocs-ref when techdocs-ref is relative', async () => {
    const directoryPreparer = new DirectoryPreparer(logger);

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      'backstage.io/techdocs-ref': 'dir:./our-documentation',
    });

    expect(normalizePath(await directoryPreparer.prepare(mockEntity))).toEqual(
      '/directory/our-documentation',
    );
  });

  it('should merge managed-by-location and techdocs-ref when techdocs-ref is absolute', async () => {
    const directoryPreparer = new DirectoryPreparer(logger);

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      'backstage.io/techdocs-ref': 'dir:/our-documentation/techdocs',
    });

    expect(normalizePath(await directoryPreparer.prepare(mockEntity))).toEqual(
      '/our-documentation/techdocs',
    );
  });

  it('should merge managed-by-location and techdocs-ref when managed-by-location is a git repository', async () => {
    const directoryPreparer = new DirectoryPreparer(logger);

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'github:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      'backstage.io/techdocs-ref': 'dir:./docs',
    });

    expect(normalizePath(await directoryPreparer.prepare(mockEntity))).toEqual(
      '/tmp/backstage-repo/org/name/branch/docs',
    );
    expect(checkoutGitRepository).toHaveBeenCalledTimes(1);
  });
});
