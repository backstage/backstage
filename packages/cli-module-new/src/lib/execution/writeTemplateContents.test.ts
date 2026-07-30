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

import { relative as relativePath, resolve as resolvePath } from 'node:path';
import {
  injectPackageJsonInput,
  writeTemplateContents,
} from './writeTemplateContents';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import fs from 'fs-extra';
import { loadPortableTemplate } from '../preparation/loadPortableTemplate';
import { packageVersions } from '../version';

const mockDir = createMockDirectory();
overrideTargetPaths(mockDir.path);

const baseConfig = {
  version: '0.1.0',
  license: 'Apache-2.0',
  private: true,
};

describe('writeTemplateContents', () => {
  beforeEach(() => {
    mockDir.clear();
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: { packages: ['packages/*', 'plugins/*'] },
      }),
    });
    jest.resetAllMocks();
  });

  it('should write an empty template', async () => {
    const { targetDir } = await writeTemplateContents(
      {
        name: 'test',
        files: [],
        role: 'frontend-plugin',
        values: {},
      },
      {
        ...baseConfig,
        roleParams: { role: 'frontend-plugin', pluginId: 'test' },
        packageName: '@internal/plugin-test',
        packagePath: 'plugins/plugin-test',
      },
    );

    expect(relativePath(mockDir.path, targetDir)).toBe('plugins/plugin-test');
    expect(mockDir.content()).toEqual({
      'package.json': JSON.stringify({
        workspaces: { packages: ['packages/*', 'plugins/*'] },
      }),
    });
  });

  it('should write template with various files', async () => {
    await writeTemplateContents(
      {
        name: 'test',
        files: [
          {
            content: 'test',
            path: 'test.txt',
          },
          {
            content: 'id={{ pluginId}}',
            path: 'plugin.txt',
            syntax: 'handlebars',
          },
          {
            content: '{"x":1}',
            path: 'test.json',
          },
        ],
        role: 'frontend-plugin',
        values: {},
      },
      {
        ...baseConfig,
        roleParams: { role: 'frontend-plugin', pluginId: 'test' },
        packageName: '@internal/plugin-test',
        packagePath: 'out',
      },
    );

    expect(mockDir.content()).toEqual({
      'package.json': JSON.stringify({
        workspaces: { packages: ['packages/*', 'plugins/*'] },
      }),
      out: {
        'test.txt': 'test',
        'plugin.txt': 'id=test',
        'test.json': '{"x":1}',
      },
    });
  });

  it('should generate table row headers and backend module dependencies', async () => {
    const frontendTemplate = await loadPortableTemplate({
      name: 'frontend-plugin',
      target: resolvePath(
        __dirname,
        '../../../templates/frontend-plugin/portable-template.yaml',
      ),
    });
    await writeTemplateContents(frontendTemplate, {
      ...baseConfig,
      roleParams: {
        role: 'frontend-plugin',
        pluginId: 'todos',
      },
      packageName: '@internal/plugin-todos',
      packagePath: 'plugins/todos',
    });

    await expect(
      fs.readFile(
        mockDir.resolve('plugins/todos/src/components/TodoList/TodoList.tsx'),
        'utf8',
      ),
    ).resolves.toContain('isRowHeader: true');

    const input = {
      ...baseConfig,
      roleParams: {
        role: 'backend-plugin-module' as const,
        pluginId: 'scaffolder',
        moduleId: 'custom-actions',
        pluginPackage: '@backstage/plugin-scaffolder-backend',
      },
      packageName: '@internal/plugin-scaffolder-backend-module-custom-actions',
      packagePath: 'plugins/scaffolder-backend-module-custom-actions',
    };
    const backendModuleTemplate = await loadPortableTemplate({
      name: 'scaffolder-backend-module',
      target: resolvePath(
        __dirname,
        '../../../templates/scaffolder-backend-module/portable-template.yaml',
      ),
    });
    await writeTemplateContents(backendModuleTemplate, input);

    await expect(
      fs.readJson(
        mockDir.resolve(
          'plugins/scaffolder-backend-module-custom-actions/package.json',
        ),
      ),
    ).resolves.toEqual(
      expect.objectContaining({
        devDependencies: expect.objectContaining({
          '@backstage/plugin-scaffolder-backend': `^${packageVersions['@backstage/plugin-scaffolder-backend']}`,
        }),
      }),
    );

    const resolvePluginPackageVersion = jest.fn(() => 'workspace:^');
    const packageWithCustomPlugin = JSON.parse(
      injectPackageJsonInput(
        {
          ...input,
          roleParams: {
            ...input.roleParams,
            pluginId: 'custom',
            pluginPackage: '@acme/plugin-custom-backend',
          },
        },
        JSON.stringify({ name: input.packageName }),
        resolvePluginPackageVersion,
      ),
    );
    expect(packageWithCustomPlugin.devDependencies).toEqual({
      '@acme/plugin-custom-backend': 'workspace:^',
    });
    expect(resolvePluginPackageVersion).toHaveBeenCalledTimes(1);

    const packageWithExistingDependency = JSON.parse(
      injectPackageJsonInput(
        input,
        JSON.stringify({
          name: input.packageName,
          dependencies: {
            '@backstage/plugin-scaffolder-backend': '^2.0.0',
          },
        }),
        resolvePluginPackageVersion,
      ),
    );
    expect(packageWithExistingDependency).toEqual(
      expect.objectContaining({
        dependencies: {
          '@backstage/plugin-scaffolder-backend': '^2.0.0',
        },
      }),
    );
    expect(packageWithExistingDependency).not.toHaveProperty('devDependencies');
    expect(resolvePluginPackageVersion).toHaveBeenCalledTimes(1);
  });
});
