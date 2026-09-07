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

import { relative as relativePath } from 'node:path';
import {
  injectPackageJsonInput,
  writeTemplateContents,
} from './writeTemplateContents';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';

const mockDir = createMockDirectory();
overrideTargetPaths(mockDir.path);

const baseConfig = {
  version: '0.1.0',
  license: 'Apache-2.0',
  private: true,
};

const backendModuleInput = {
  ...baseConfig,
  roleParams: {
    role: 'backend-plugin-module' as const,
    pluginId: 'custom',
    moduleId: 'custom-actions',
    pluginPackage: '@acme/plugin-custom-backend',
  },
  packageName: '@internal/plugin-custom-backend-module-custom-actions',
  packagePath: 'plugins/custom-backend-module-custom-actions',
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

  it('should add the plugin package to backend module development dependencies', () => {
    const resolvePluginPackageVersion = jest.fn(() => 'workspace:^');
    const packageWithCustomPlugin = JSON.parse(
      injectPackageJsonInput(
        backendModuleInput,
        JSON.stringify({ name: backendModuleInput.packageName }),
        resolvePluginPackageVersion,
      ),
    );
    expect(packageWithCustomPlugin.devDependencies).toEqual({
      '@acme/plugin-custom-backend': 'workspace:^',
    });
    expect(resolvePluginPackageVersion).toHaveBeenCalledWith(
      '@acme/plugin-custom-backend',
    );
  });

  it('should skip the plugin package when its version cannot be resolved', () => {
    const resolvePluginPackageVersion = jest.fn(() => undefined);
    const packageWithoutPluginVersion = JSON.parse(
      injectPackageJsonInput(
        backendModuleInput,
        JSON.stringify({ name: backendModuleInput.packageName }),
        resolvePluginPackageVersion,
      ),
    );
    expect(packageWithoutPluginVersion).not.toHaveProperty('devDependencies');
    expect(resolvePluginPackageVersion).toHaveBeenCalledWith(
      '@acme/plugin-custom-backend',
    );
  });

  it('should preserve an existing backend plugin package dependency', () => {
    const resolvePluginPackageVersion = jest.fn(() => 'workspace:^');
    const packageWithExistingDependency = JSON.parse(
      injectPackageJsonInput(
        backendModuleInput,
        JSON.stringify({
          name: backendModuleInput.packageName,
          dependencies: {
            '@acme/plugin-custom-backend': '^2.0.0',
          },
        }),
        resolvePluginPackageVersion,
      ),
    );
    expect(packageWithExistingDependency).toEqual(
      expect.objectContaining({
        dependencies: {
          '@acme/plugin-custom-backend': '^2.0.0',
        },
      }),
    );
    expect(packageWithExistingDependency).not.toHaveProperty('devDependencies');
    expect(resolvePluginPackageVersion).not.toHaveBeenCalled();
  });
});
