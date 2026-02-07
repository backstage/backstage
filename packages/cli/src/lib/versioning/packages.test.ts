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

import * as runObj from '@backstage/cli-common';
import * as yarn from './yarn';
import { fetchPackageInfo, mapDependencies } from './packages';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';

jest.mock('@backstage/cli-common', () => {
  const actual = jest.requireActual('@backstage/cli-common');
  return {
    ...actual,
    runOutput: jest.fn(),
  };
});

jest.mock('./yarn', () => {
  return {
    detectYarnVersion: jest.fn(),
  };
});

describe('fetchPackageInfo', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should forward info for yarn classic', async () => {
    jest
      .spyOn(runObj, 'runOutput')
      .mockResolvedValue(`{"type":"inspect","data":{"the":"data"}}`);
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('classic');

    await expect(fetchPackageInfo('my-package')).resolves.toEqual({
      the: 'data',
    });
    expect(runObj.runOutput).toHaveBeenCalledWith([
      'yarn',
      'info',
      '--json',
      'my-package',
    ]);
  });

  it('should forward info for yarn berry', async () => {
    jest.spyOn(runObj, 'runOutput').mockResolvedValue(`{"the":"data"}`);
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('berry');

    await expect(fetchPackageInfo('my-package')).resolves.toEqual({
      the: 'data',
    });
    expect(runObj.runOutput).toHaveBeenCalledWith([
      'yarn',
      'npm',
      'info',
      '--json',
      'my-package',
    ]);
  });

  it('should throw if no info with yarn classic', async () => {
    jest.spyOn(runObj, 'runOutput').mockResolvedValue('');
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('classic');

    await expect(fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );
  });

  it('should throw if no info with yarn berry', async () => {
    const error = new Error('Command failed');
    (error as Error & { stdout?: string }).stdout =
      'bla bla bla Response Code: 404 bla bla';
    jest.spyOn(runObj, 'runOutput').mockRejectedValue(error);
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('berry');

    await expect(fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );
  });
});

describe('mapDependencies', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should read dependencies', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: ['pkgs/*'],
      }),
      pkgs: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '1 || 2',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '3',
              '@backstage/cli': '^0',
            },
          }),
        },
      },
    });

    const dependencyMap = await mapDependencies(mockDir.path, '@backstage/*');
    expect(Array.from(dependencyMap)).toEqual([
      [
        '@backstage/core',
        [
          {
            name: 'a',
            range: '1 || 2',
            location: mockDir.resolve('pkgs/a'),
          },
          {
            name: 'b',
            range: '3',
            location: mockDir.resolve('pkgs/b'),
          },
        ],
      ],
      [
        '@backstage/cli',
        [
          {
            name: 'b',
            range: '^0',
            location: mockDir.resolve('pkgs/b'),
          },
        ],
      ],
    ]);
  });
});
