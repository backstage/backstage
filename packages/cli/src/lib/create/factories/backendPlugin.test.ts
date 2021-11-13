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
import mockFs from 'mock-fs';
import { resolve as resolvePath } from 'path';
import { WriteStream } from 'tty';
import { paths } from '../../paths';
import { Task } from '../../tasks';
import { FactoryRegistry } from '../FactoryRegistry';
import { backendPlugin } from './backendPlugin';

function createMockOutputStream() {
  const output = new Array<string>();
  return [
    output,
    {
      cursorTo: () => {},
      clearLine: () => {},
      moveCursor: () => {},
      write: (msg: string) =>
        // Clean up colors and whitespace
        // eslint-disable-next-line no-control-regex
        output.push(msg.replace(/\x1B\[\d\dm/g, '').trim()),
    } as unknown as WriteStream & { fd: any },
  ] as const;
}

describe('backendPlugin factory', () => {
  beforeEach(() => {
    jest.spyOn(paths, 'targetRoot', 'get').mockReturnValue('/root');
    jest
      .spyOn(paths, 'resolveTargetRoot')
      .mockImplementation((...ps) => resolvePath('/root', ...ps));
  });

  afterEach(() => {
    mockFs.restore();
    jest.resetAllMocks();
  });

  it('should create a backend plugin', async () => {
    mockFs({
      '/root': {
        packages: {
          backend: {
            'package.json': JSON.stringify({}),
          },
        },
        plugins: mockFs.directory(),
      },
      [paths.resolveOwn('templates')]: mockFs.load(
        paths.resolveOwn('templates'),
      ),
    });

    const options = await FactoryRegistry.populateOptions(backendPlugin, {
      id: 'test',
    });

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await backendPlugin.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: () => fs.mkdtemp('test'),
    });

    expect(modified).toBe(true);

    expect(output).toEqual([
      '',
      'Creating backend plugin plugin-test-backend',
      'Checking Prerequisites:',
      'availability  plugins/test-backend ✔',
      'creating      temp dir ✔',
      'Executing Template:',
      'copying       .eslintrc.js ✔',
      'templating    README.md.hbs ✔',
      'templating    package.json.hbs ✔',
      'copying       tsconfig.json ✔',
      'copying       index.ts ✔',
      'templating    run.ts.hbs ✔',
      'copying       setupTests.ts ✔',
      'copying       router.test.ts ✔',
      'copying       router.ts ✔',
      'templating    standaloneServer.ts.hbs ✔',
      'Installing:',
      'moving        plugins/test-backend ✔',
      'backend       adding dependency ✔',
    ]);

    await expect(
      fs.readJson('/root/packages/backend/package.json'),
    ).resolves.toEqual({
      dependencies: {
        'plugin-test-backend': '^1.0.0',
      },
    });

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: '/root/plugins/test-backend',
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: '/root/plugins/test-backend',
      optional: true,
    });
  });
});
