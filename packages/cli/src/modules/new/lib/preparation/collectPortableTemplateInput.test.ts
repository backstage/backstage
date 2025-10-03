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
import { withLogCollector } from '@backstage/test-utils';

describe('collectTemplateParams', () => {
  const baseOptions = {
    config: {
      isUsingDefaultTemplates: false,
      templatePointers: [],
      version: '0.1.0',
      license: 'Apache-2.0',
      private: true,
      packageNamePrefix: '@internal/',
      packageNamePluginInfix: 'plugin-',
    } satisfies PortableTemplateConfig,
    template: {
      name: 'test',
      role: 'frontend-plugin' as const,
      files: [],
      values: {},
    },
    prefilledParams: {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
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
      owner: undefined,
      version: '0.1.0',
      license: 'Apache-2.0',
      private: true,
      publishRegistry: undefined,
      packageName: '@internal/plugin-other',
      packagePath: 'plugins/other',
      customValues: undefined,
    });
  });

  it('should pick up prefilled parameters', async () => {
    await expect(
      collectPortableTemplateInput({
        ...baseOptions,
        prefilledParams: {
          pluginId: 'test1',
          owner: 'me',
        },
      }),
    ).resolves.toEqual({
      roleParams: {
        role: 'frontend-plugin',
        pluginId: 'test1',
      },
      owner: 'me',
      version: '0.1.0',
      license: 'Apache-2.0',
      private: true,
      publishRegistry: undefined,
      packageName: '@internal/plugin-test1',
      packagePath: 'plugins/test1',
      customValues: undefined,
    });
  });

  it('should pick up template values', async () => {
    await expect(
      collectPortableTemplateInput({
        ...baseOptions,
        template: {
          ...baseOptions.template,
          values: {
            pluginId: 'test2',
            owner: 'me',
          },
        },
      }),
    ).resolves.toEqual({
      roleParams: {
        role: 'frontend-plugin',
        pluginId: 'test2',
      },
      owner: 'me',
      version: '0.1.0',
      license: 'Apache-2.0',
      private: true,
      publishRegistry: undefined,
      packageName: '@internal/plugin-test2',
      packagePath: 'plugins/test2',
      customValues: undefined,
    });
  });

  it('should map deprecated id param to pluginId', async () => {
    const logs = await withLogCollector(async () => {
      await expect(
        collectPortableTemplateInput({
          ...baseOptions,
          config: {
            ...baseOptions.config,
            isUsingDefaultTemplates: true,
          },
          prefilledParams: {
            id: 'test3',
            owner: 'me',
          },
        }),
      ).resolves.toEqual({
        roleParams: {
          role: 'frontend-plugin',
          pluginId: 'test3',
        },
        owner: 'me',
        version: '0.1.0',
        license: 'Apache-2.0',
        private: true,
        publishRegistry: undefined,
        packageName: '@internal/plugin-test3',
        packagePath: 'plugins/test3',
        customValues: undefined,
      });
    });
    expect(logs).toEqual({
      error: [],
      log: [],
      warn: [
        `DEPRECATION WARNING: The 'id' parameter is deprecated, use 'pluginId' instead`,
      ],
    });
  });

  it('should preserve custom values that do not match prompts', async () => {
    await expect(
      collectPortableTemplateInput({
        ...baseOptions,
        prefilledParams: {
          pluginId: 'test-plugin',
          customApiUrl: 'https://api.example.com',
          databaseType: 'postgres',
          enableFeature: 'true',
        },
      }),
    ).resolves.toEqual({
      roleParams: {
        role: 'frontend-plugin',
        pluginId: 'test-plugin',
      },
      owner: undefined,
      version: '0.1.0',
      license: 'Apache-2.0',
      private: true,
      packageName: '@internal/plugin-test-plugin',
      packagePath: 'plugins/test-plugin',
      customValues: {
        customApiUrl: 'https://api.example.com',
        databaseType: 'postgres',
        enableFeature: 'true',
      },
    });
  });

  it('should not include customValues when no arbitrary values are provided', async () => {
    await expect(
      collectPortableTemplateInput({
        ...baseOptions,
        prefilledParams: {
          pluginId: 'test-plugin',
        },
      }),
    ).resolves.toEqual({
      roleParams: {
        role: 'frontend-plugin',
        pluginId: 'test-plugin',
      },
      owner: undefined,
      version: '0.1.0',
      license: 'Apache-2.0',
      private: true,
      packageName: '@internal/plugin-test-plugin',
      packagePath: 'plugins/test-plugin',
      customValues: undefined,
    });
  });
});
