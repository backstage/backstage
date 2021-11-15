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
import { paths } from '../../paths';
import { Task } from '../../tasks';
import { FactoryRegistry } from '../FactoryRegistry';
import { createMockOutputStream, mockPaths } from './common/testUtils';
import { scaffolderModule } from './scaffolderModule';

describe('scaffolderModule factory', () => {
  beforeEach(() => {
    mockPaths({
      targetRoot: '/root',
    });
  });

  afterEach(() => {
    mockFs.restore();
    jest.resetAllMocks();
  });

  it('should create a scaffolder backend module package', async () => {
    mockFs({
      '/root': {
        plugins: mockFs.directory(),
      },
      [paths.resolveOwn('templates')]: mockFs.load(
        paths.resolveOwn('templates'),
      ),
    });

    const options = await FactoryRegistry.populateOptions(scaffolderModule, {
      id: 'test',
    });

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await scaffolderModule.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: (name: string) => fs.mkdtemp(name),
    });

    expect(modified).toBe(true);

    expect(output).toEqual([
      '',
      'Creating module backstage-plugin-scaffolder-backend-module-test',
      'Checking Prerequisites:',
      'availability  plugins/scaffolder-backend-module-test ✔',
      'creating      temp dir ✔',
      'Executing Template:',
      'copying       .eslintrc.js ✔',
      'templating    README.md.hbs ✔',
      'templating    package.json.hbs ✔',
      'copying       tsconfig.json ✔',
      'templating    index.ts.hbs ✔',
      'copying       index.ts ✔',
      'copying       example.test.ts ✔',
      'copying       example.ts ✔',
      'copying       index.ts ✔',
      'Installing:',
      'moving        plugins/scaffolder-backend-module-test ✔',
    ]);

    await expect(
      fs.readJson('/root/plugins/scaffolder-backend-module-test/package.json'),
    ).resolves.toEqual(
      expect.objectContaining({
        name: 'backstage-plugin-scaffolder-backend-module-test',
        description: 'The test module for @backstage/plugin-scaffolder-backend',
        private: true,
        version: '1.0.0',
      }),
    );

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: '/root/plugins/scaffolder-backend-module-test',
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: '/root/plugins/scaffolder-backend-module-test',
      optional: true,
    });
  });
});
