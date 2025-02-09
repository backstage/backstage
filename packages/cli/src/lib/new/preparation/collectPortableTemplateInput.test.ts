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

import inquirer from 'inquirer';
import { PortableTemplateConfig } from '../types';
import { collectPortableTemplateInput } from './collectPortableTemplateInput';

describe('collectTemplateParams', () => {
  const baseOptions = {
    config: {
      isUsingDefaultTemplates: false,
      templatePointers: [],
      globals: {
        baseVersion: '0.1.0',
        license: 'Apache-2.0',
        private: true,
        packagePrefix: '@internal/',
        pluginInfix: 'plugin-',
      },
    } satisfies PortableTemplateConfig,
    template: {
      id: 'test',
      templatePath: '/test',
      targetPath: '/example',
      role: 'frontend-plugin' as const,
      files: [],
      templateValues: {},
    },
    prefilledParams: {
      pluginId: 'test',
      owner: 'me',
    },
  };

  it('should return default values if not provided', async () => {
    await expect(collectPortableTemplateInput(baseOptions)).resolves.toEqual({
      roleParams: {
        role: 'frontend-plugin',
        pluginId: 'test',
      },
      builtInParams: {
        owner: 'me',
      },
      packageParams: {
        packageName: '@internal/plugin-test',
        packagePath: 'plugins/test',
      },
      params: {
        license: 'Apache-2.0',
        packageName: '@internal/plugin-test',
        packageVersion: '0.1.0',
        privatePackage: true,
        pluginId: 'test',
        owner: 'me',
      },
      globals: baseOptions.config.globals,
    });
  });

  it('should prompt for missing parameters', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({ pluginId: 'other' });

    await expect(
      collectPortableTemplateInput({
        ...baseOptions,
        prefilledParams: {},
      }),
    ).resolves.toEqual({
      roleParams: {
        role: 'frontend-plugin',
        pluginId: 'other',
      },
      builtInParams: {
        owner: undefined,
      },
      packageParams: {
        packageName: '@internal/plugin-other',
        packagePath: 'plugins/other',
      },
      params: {
        license: 'Apache-2.0',
        packageName: '@internal/plugin-other',
        packageVersion: '0.1.0',
        privatePackage: true,
        pluginId: 'other',
        owner: undefined,
      },
      globals: baseOptions.config.globals,
    });
  });
});
