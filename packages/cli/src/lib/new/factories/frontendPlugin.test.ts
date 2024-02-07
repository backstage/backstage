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
import { frontendPlugin } from './frontendPlugin';
import { createMockDirectory } from '@backstage/backend-test-utils';

const appTsxContent = `
import { createApp } from '@backstage/app-defaults';

const router = (
  <FlatRoutes>
    <Route path="/" element={<Home />} />
  </FlatRoutes>
)
`;

describe('frontendPlugin factory', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockPaths({
      targetRoot: mockDir.path,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a frontend plugin', async () => {
    mockDir.setContent({
      packages: {
        app: {
          'package.json': JSON.stringify({}),
          src: {
            'App.tsx': appTsxContent,
          },
        },
      },
      plugins: {},
    });

    const options = await FactoryRegistry.populateOptions(frontendPlugin, {
      id: 'test',
    });

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await frontendPlugin.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: () => fs.mkdtemp('test'),
    });

    expect(modified).toBe(true);

    expectLogsToMatch(output, [
      'Creating frontend plugin backstage-plugin-test',
      'Checking Prerequisites:',
      `availability  plugins${sep}test`,
      'creating      temp dir',
      'Executing Template:',
      'copying       .eslintrc.js',
      'templating    README.md.hbs',
      'templating    package.json.hbs',
      'templating    index.tsx.hbs',
      'templating    index.ts.hbs',
      'templating    plugin.test.ts.hbs',
      'templating    plugin.ts.hbs',
      'templating    routes.ts.hbs',
      'copying       setupTests.ts',
      'templating    ExampleComponent.test.tsx.hbs',
      'templating    ExampleComponent.tsx.hbs',
      'copying       index.ts',
      'templating    ExampleFetchComponent.test.tsx.hbs',
      'templating    ExampleFetchComponent.tsx.hbs',
      'copying       index.ts',
      'Installing:',
      `moving        plugins${sep}test`,
      'app           adding dependency',
      'app           adding import',
    ]);

    await expect(
      fs.readJson(mockDir.resolve('packages/app/package.json')),
    ).resolves.toEqual({
      dependencies: {
        'backstage-plugin-test': '^1.0.0',
      },
    });

    await expect(
      fs.readFile(mockDir.resolve('packages/app/src/App.tsx'), 'utf8'),
    ).resolves.toBe(`
import { createApp } from '@backstage/app-defaults';
import { TestPage } from 'backstage-plugin-test';

const router = (
  <FlatRoutes>
    <Route path="/" element={<Home />} />
    <Route path="/test" element={<TestPage />} />
  </FlatRoutes>
)
`);

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: mockDir.resolve('plugins/test'),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: mockDir.resolve('plugins/test'),
      optional: true,
    });
  });

  it('should create a frontend plugin with more options and codeowners', async () => {
    mockDir.setContent({
      CODEOWNERS: '',
      packages: {
        app: {
          'package.json': JSON.stringify({}),
          src: {
            'App.tsx': appTsxContent,
          },
        },
      },
      plugins: {},
    });

    const options = await FactoryRegistry.populateOptions(frontendPlugin, {
      id: 'test',
      owner: '@test-user',
    });

    const [, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await frontendPlugin.create(options, {
      scope: 'internal',
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {},
      createTemporaryDirectory: () => fs.mkdtemp('test'),
    });

    await expect(
      fs.readJson(mockDir.resolve('packages/app/package.json')),
    ).resolves.toEqual({
      dependencies: {
        '@internal/backstage-plugin-test': '^1.0.0',
      },
    });

    await expect(
      fs.readFile(mockDir.resolve('packages/app/src/App.tsx'), 'utf8'),
    ).resolves.toBe(`
import { createApp } from '@backstage/app-defaults';
import { TestPage } from '@internal/backstage-plugin-test';

const router = (
  <FlatRoutes>
    <Route path="/" element={<Home />} />
    <Route path="/test" element={<TestPage />} />
  </FlatRoutes>
)
`);

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: mockDir.resolve('plugins/test'),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: mockDir.resolve('plugins/test'),
      optional: true,
    });
  });
});
