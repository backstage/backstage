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

import { Configuration, Project, structUtils, httpUtils } from '@yarnpkg/core';
import { npath, ppath } from '@yarnpkg/fslib';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { reduceDependency } from './reduceDependency';

describe('reduceDependency', () => {
  const mockDir = createMockDirectory();
  let project: Project;
  let getMock: jest.SpyInstance<
    ReturnType<(typeof httpUtils)['get']>,
    Parameters<(typeof httpUtils)['get']>
  >;

  beforeEach(() => {
    project = new Project(ppath.cwd(), {
      configuration: Configuration.create(ppath.cwd()),
    });

    jest
      .spyOn(ppath, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    getMock = jest.spyOn(httpUtils, 'get').mockResolvedValue({
      releaseVersion: '1.23.45',
      packages: [
        {
          name: '@backstage/core',
          version: '6.7.8',
        },
      ],
    });

    mockDir.setContent({
      'backstage.json': JSON.stringify({
        version: '1.23.45',
      }),
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': 'backstage:^',
            },
          }),
        },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    range
    ${'npm:1.2.3'}
    ${'link:../foo/bar'}
    ${'workspace:^'}
  `('returns non-backstage range "$range" unchanged', async ({ range }) => {
    const descriptor = structUtils.makeDescriptor(
      structUtils.makeIdent('backstage', 'core'),
      range,
    );

    await expect(reduceDependency(descriptor, project)).resolves.toEqual(
      descriptor,
    );
  });

  it.each`
    selector
    ${'*'}
    ${'latest'}
  `(
    'rejects backstage: ranges with invalid selector "$selector"',
    async ({ selector }) => {
      await expect(
        reduceDependency(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            `backstage:${selector}`,
          ),
          project,
        ),
      ).rejects.toThrow(/unexpected version selector/i);
    },
  );

  describe('with range "backstage:^"', () => {
    it('loads the manifest for the current Backstage version', async () => {
      await reduceDependency(
        structUtils.makeDescriptor(
          structUtils.makeIdent('backstage', 'core'),
          'backstage:^',
        ),
        project,
      );

      expect(getMock).toHaveBeenCalledWith(
        'https://versions.backstage.io/v1/releases/1.23.45/manifest.json',
        expect.anything(),
      );
    });

    it('replaces the range with the corresponding npm package range', async () => {
      await expect(
        reduceDependency(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:^',
          ),
          project,
        ),
      ).resolves.toEqual(
        structUtils.makeDescriptor(
          structUtils.makeIdent('backstage', 'core'),
          'npm:^6.7.8',
        ),
      );
    });

    it(`throws for packages that don't appear in the manifest`, async () => {
      await expect(
        reduceDependency(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'other'),
            'backstage:^',
          ),
          project,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining(
            'Package @backstage/other not found in manifest for Backstage v1.23.45',
          ),
        }),
      );
    });
  });
});
