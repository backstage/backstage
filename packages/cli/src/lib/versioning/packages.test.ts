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

import mockFs from 'mock-fs';
import path from 'path';
import * as runObj from '../run';
import * as yarn from '../yarn';
import { fetchPackageInfo, mapDependencies } from './packages';
import { NotFoundError } from '../errors';

jest.mock('../run', () => {
  return {
    run: jest.fn(),
    execFile: jest.fn(),
  };
});

jest.mock('../yarn', () => {
  return {
    detectYarnVersion: jest.fn(),
  };
});

describe('fetchPackageInfo', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should forward info for yarn classic', async () => {
    jest.spyOn(runObj, 'execFile').mockResolvedValue({
      stdout: `{"type":"inspect","data":{"the":"data"}}`,
      stderr: '',
    });
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('classic');

    await expect(fetchPackageInfo('my-package')).resolves.toEqual({
      the: 'data',
    });
    expect(runObj.execFile).toHaveBeenCalledWith(
      'yarn',
      ['info', '--json', 'my-package'],
      { shell: true },
    );
  });

  it('should forward info for yarn berry', async () => {
    jest
      .spyOn(runObj, 'execFile')
      .mockResolvedValue({ stdout: `{"the":"data"}`, stderr: '' });
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('berry');

    await expect(fetchPackageInfo('my-package')).resolves.toEqual({
      the: 'data',
    });
    expect(runObj.execFile).toHaveBeenCalledWith(
      'yarn',
      ['npm', 'info', '--json', 'my-package'],
      { shell: true },
    );
  });

  it('should throw if no info with yarn classic', async () => {
    jest
      .spyOn(runObj, 'execFile')
      .mockResolvedValue({ stdout: '', stderr: '' });
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('classic');

    await expect(fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );
  });

  it('should throw if no info with yarn berry', async () => {
    jest
      .spyOn(runObj, 'execFile')
      .mockRejectedValue({ stdout: 'bla bla bla Response Code: 404 bla bla' });
    jest.spyOn(yarn, 'detectYarnVersion').mockResolvedValue('berry');

    await expect(fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );
  });
});

describe('mapDependencies', () => {
  afterEach(() => {
    mockFs.restore();
    jest.resetAllMocks();
  });

  it('should read dependencies', async () => {
    mockFs({
      '/root/package.json': JSON.stringify({
        workspaces: {
          packages: ['pkgs/*'],
        },
      }),
      '/root/pkgs/a/package.json': JSON.stringify({
        name: 'a',
        dependencies: {
          '@backstage/core': '1 || 2',
        },
      }),
      '/root/pkgs/b/package.json': JSON.stringify({
        name: 'b',
        dependencies: {
          '@backstage/core': '3',
          '@backstage/cli': '^0',
        },
      }),
    });

    const dependencyMap = await mapDependencies('/root', '@backstage/*');
    expect(Array.from(dependencyMap)).toEqual([
      [
        '@backstage/core',
        [
          {
            name: 'a',
            range: '1 || 2',
            location: path.resolve('/root/pkgs/a'),
          },
          {
            name: 'b',
            range: '3',
            location: path.resolve('/root/pkgs/b'),
          },
        ],
      ],
      [
        '@backstage/cli',
        [
          {
            name: 'b',
            range: '^0',
            location: path.resolve('/root/pkgs/b'),
          },
        ],
      ],
    ]);
  });
});
