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

import { Manifest, Workspace } from '@yarnpkg/core';
import { npath, ppath } from '@yarnpkg/fslib';
import { createMockDirectory } from '@backstage/backend-test-utils';

import { beforeWorkspacePacking } from './beforeWorkspacePacking';

jest.mock('@backstage/release-manifests', () => ({
  getManifestByVersion: jest.fn().mockResolvedValue({
    releaseVersion: '1.23.45',
    packages: [
      {
        name: '@backstage/core',
        version: '3.2.1',
      },
    ],
  }),
}));

const makeWorkspace = (manifest: object) => {
  return {
    manifest: Manifest.fromText(JSON.stringify(manifest)),
  } as Workspace;
};

describe('beforeWorkspacePacking', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    jest
      .spyOn(ppath, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    mockDir.setContent({
      'backstage.json': JSON.stringify({
        version: '1.23.45',
      }),
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe.each`
    dependencyType
    ${'dependencies'}
    ${'devDependencies'}
    ${'optionalDependencies'}
  `('$dependencyType', ({ dependencyType }) => {
    it(`ignores ${dependencyType} that don't use the backstage: protocol`, () => {
      const result = {
        name: 'test-package',
        [dependencyType]: {
          foo: '^1.1.1',
        },
      };

      beforeWorkspacePacking(makeWorkspace(result), result);

      expect(result).toEqual({
        name: 'test-package',
        [dependencyType]: {
          foo: '^1.1.1',
        },
      });
    });

    it(`throws an error for any backstage: versions with a selector other than ^`, async () => {
      const result = {
        name: 'test-package',
        [dependencyType]: {
          '@backstage/core': 'backstage:^1.1.1',
        },
      };

      await expect(() =>
        beforeWorkspacePacking(makeWorkspace(result), result),
      ).rejects.toThrow();
    });

    it('converts backstage:^ versions to the corresponding package version prefixed by ^', async () => {
      const result = {
        name: 'test-package',
        [dependencyType]: {
          '@backstage/core': 'backstage:^',
        },
      };

      await beforeWorkspacePacking(makeWorkspace(result), result);

      expect(result).toEqual({
        name: 'test-package',
        [dependencyType]: {
          '@backstage/core': '^3.2.1',
        },
      });
    });
  });
});
