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
      packageName: '@internal/plugin-other',
      packagePath: 'plugins/other',
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
      packageName: '@internal/plugin-test1',
      packagePath: 'plugins/test1',
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
      packageName: '@internal/plugin-test2',
      packagePath: 'plugins/test2',
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
        packageName: '@internal/plugin-test3',
        packagePath: 'plugins/test3',
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

  describe('backend-plugin-module with pluginPackage', () => {
    const backendModuleOptions = {
      ...baseOptions,
      template: {
        name: 'test-module',
        role: 'backend-plugin-module' as const,
        files: [],
        values: {},
      },
    };

    it('should auto-fill pluginPackage for catalog plugin without prompting', async () => {
      await expect(
        collectPortableTemplateInput({
          ...backendModuleOptions,
          prefilledParams: {
            pluginId: 'catalog',
            moduleId: 'my-module',
          },
        }),
      ).resolves.toEqual({
        roleParams: {
          role: 'backend-plugin-module',
          pluginId: 'catalog',
          moduleId: 'my-module',
          pluginPackage: '@backstage/plugin-catalog-backend',
        },
        owner: undefined,
        version: '0.1.0',
        license: 'Apache-2.0',
        private: true,
        packageName: '@internal/plugin-catalog-backend-module-my-module',
        packagePath: 'plugins/catalog-backend-module-my-module',
      });
    });

    it('should prompt for pluginPackage for unknown plugins', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        pluginPackage: '@mycompany/plugin-custom-backend',
      });

      await expect(
        collectPortableTemplateInput({
          ...backendModuleOptions,
          prefilledParams: {
            pluginId: 'custom',
            moduleId: 'my-extension',
          },
        }),
      ).resolves.toEqual({
        roleParams: {
          role: 'backend-plugin-module',
          pluginId: 'custom',
          moduleId: 'my-extension',
          pluginPackage: '@mycompany/plugin-custom-backend',
        },
        owner: undefined,
        version: '0.1.0',
        license: 'Apache-2.0',
        private: true,
        packageName: '@internal/plugin-custom-backend-module-my-extension',
        packagePath: 'plugins/custom-backend-module-my-extension',
      });
    });
  });

  describe('frontend-plugin-module with pluginPackage', () => {
    const frontendModuleOptions = {
      ...baseOptions,
      template: {
        name: 'test-module',
        role: 'frontend-plugin-module' as const,
        files: [],
        values: {},
      },
    };

    it('should auto-fill pluginPackage for catalog plugin without prompting', async () => {
      await expect(
        collectPortableTemplateInput({
          ...frontendModuleOptions,
          prefilledParams: {
            pluginId: 'catalog',
            moduleId: 'my-module',
          },
        }),
      ).resolves.toEqual({
        roleParams: {
          role: 'frontend-plugin-module',
          pluginId: 'catalog',
          moduleId: 'my-module',
          pluginPackage: '@backstage/plugin-catalog',
        },
        owner: undefined,
        version: '0.1.0',
        license: 'Apache-2.0',
        private: true,
        packageName: '@internal/plugin-catalog-module-my-module',
        packagePath: 'plugins/catalog-module-my-module',
      });
    });

    it('should prompt for pluginPackage for unknown plugins', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        pluginPackage: '@mycompany/plugin-custom',
      });

      await expect(
        collectPortableTemplateInput({
          ...frontendModuleOptions,
          prefilledParams: {
            pluginId: 'custom',
            moduleId: 'my-extension',
          },
        }),
      ).resolves.toEqual({
        roleParams: {
          role: 'frontend-plugin-module',
          pluginId: 'custom',
          moduleId: 'my-extension',
          pluginPackage: '@mycompany/plugin-custom',
        },
        owner: undefined,
        version: '0.1.0',
        license: 'Apache-2.0',
        private: true,
        packageName: '@internal/plugin-custom-module-my-extension',
        packagePath: 'plugins/custom-module-my-extension',
      });
    });
  });
});
