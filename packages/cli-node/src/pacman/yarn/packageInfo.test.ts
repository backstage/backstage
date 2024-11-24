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
import * as runObj from '../../util';
import { NotFoundError } from '../../errors';
import { fetchPackageInfo } from './packageInfo';
import { YarnVersion } from './types';

jest.mock('../../util', () => {
  return {
    execFile: jest.fn(),
  };
});

const berry: YarnVersion = { codename: 'berry', version: '3.0.0' };
const classic: YarnVersion = { codename: 'classic', version: '1.22.0' };

describe('fetchPackageInfo', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should forward info for yarn classic', async () => {
    jest.spyOn(runObj, 'execFile').mockResolvedValue({
      stdout: `{"type":"inspect","data":{"the":"data"}}`,
      stderr: '',
    });

    await expect(fetchPackageInfo('my-package', classic)).resolves.toEqual({
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

    await expect(fetchPackageInfo('my-package', berry)).resolves.toEqual({
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

    await expect(fetchPackageInfo('my-package', classic)).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );
  });

  it('should throw if no info with yarn berry', async () => {
    jest
      .spyOn(runObj, 'execFile')
      .mockRejectedValue({ stdout: 'bla bla bla Response Code: 404 bla bla' });

    await expect(fetchPackageInfo('my-package', berry)).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );
  });
});
