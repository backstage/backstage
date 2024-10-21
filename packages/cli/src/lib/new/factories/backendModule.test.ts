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
import { sep } from 'path';
import { Task } from '../../tasks';
import { FactoryRegistry } from '../FactoryRegistry';
import {
  createMockOutputStream,
  expectLogsToMatch,
  mockPaths,
} from './common/testUtils';
import { backendModule } from './backendModule';
import { createMockDirectory } from '@backstage/backend-test-utils';

const backendIndexTsContent = `
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.start();
`;

describe('backendModule factory', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockPaths({
      targetRoot: mockDir.path,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a backend plugin', async () => {
    mockDir.setContent({
      packages: {
        backend: {
          'package.json': JSON.stringify({}),
          src: {
            'index.ts': backendIndexTsContent,
          },
        },
      },
      plugins: {},
    });

    const options = await FactoryRegistry.populateOptions(backendModule, {
      id: 'test',
      moduleId: 'tester-two',
    });

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await backendModule.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: () => fs.mkdtemp('test'),
      license: 'Apache-2.0',
    });

    expect(modified).toBe(true);

    expectLogsToMatch(output, [
      'Creating backend module backstage-plugin-test-backend-module-tester-two',
      'Checking Prerequisites:',
      `availability  plugins${sep}test-backend-module-tester-two`,
      'creating      temp dir',
      'Executing Template:',
      'templating    .eslintrc.js.hbs',
      'templating    README.md.hbs',
      'templating    package.json.hbs',
      'templating    index.ts.hbs',
      'templating    module.ts.hbs',
      'Installing:',
      `moving        plugins${sep}test-backend-module-tester-two`,
      'backend       adding dependency',
      'backend       adding module',
    ]);

    await expect(
      fs.readFile(mockDir.resolve('packages/backend/src/index.ts'), 'utf8'),
    ).resolves.toBe(`
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('backstage-plugin-test-backend-module-tester-two'));
backend.start();
`);

    await expect(
      fs.readJson(mockDir.resolve('packages/backend/package.json')),
    ).resolves.toEqual({
      dependencies: {
        'backstage-plugin-test-backend-module-tester-two': '^1.0.0',
      },
    });
    const moduleFile = await fs.readFile(
      mockDir.resolve('plugins/test-backend-module-tester-two/src/module.ts'),
      'utf-8',
    );

    expect(moduleFile).toContain(
      `const testModuleTesterTwo = createBackendModule({`,
    );
    expect(moduleFile).toContain(`pluginId: 'test',`);
    expect(moduleFile).toContain(`moduleId: 'tester-two',`);

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: mockDir.resolve('plugins/test-backend-module-tester-two'),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: mockDir.resolve('plugins/test-backend-module-tester-two'),
      optional: true,
    });
  });
});
