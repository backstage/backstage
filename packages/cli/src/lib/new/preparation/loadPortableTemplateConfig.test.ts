/*
 * Copyright 2025 The Backstage Authors
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

import { realpathSync } from 'node:fs';
import { loadPortableTemplateConfig } from './loadPortableTemplateConfig';
import { defaultTemplates } from '../defaultTemplates';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('loadPortableTemplateConfig', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  it('should load configuration from package.json', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          cli: {
            new: {
              templates: ['./path/to/template1', './path/to/template2.yaml'],
              globals: {
                license: 'MIT',
                private: true,
                namePrefix: '@acme/',
                namePluginInfix: 'backstage-plugin-',
              },
            },
          },
        },
      }),
      'path/to/template1/template.yaml':
        'name: template1\nrole: frontend-plugin\n',
      'path/to/template2.yaml': 'name: template2\nrole: frontend-plugin\n',
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: false,
      templatePointers: [
        {
          name: 'template1',
          target: mockDir.resolve('path/to/template1/template.yaml'),
        },
        {
          name: 'template2',
          target: mockDir.resolve('path/to/template2.yaml'),
        },
      ],
      license: 'MIT',
      private: true,
      version: '0.1.0',
      packageNamePrefix: '@acme/',
      packageNamePluginInfix: 'backstage-plugin-',
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
        overrides: {
          license: 'nope',
          private: false,
        },
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: false,
      templatePointers: [
        {
          name: 'template1',
          target: mockDir.resolve('path/to/template1/template.yaml'),
        },
        {
          name: 'template2',
          target: mockDir.resolve('path/to/template2.yaml'),
        },
      ],
      license: 'nope',
      version: '0.1.0',
      private: false,
      packageNamePrefix: '@acme/',
      packageNamePluginInfix: 'backstage-plugin-',
    });
  });

  it('should support pointing to built-in templates', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          cli: {
            new: {
              templates: ['@my/package/templates/plugin', 'my-package'],
              globals: {
                license: 'MIT',
                private: true,
                namePrefix: '@acme/',
                namePluginInfix: 'backstage-plugin-',
              },
            },
          },
        },
      }),
      node_modules: {
        '@my': {
          package: {
            templates: {
              plugin: {
                'template.yaml':
                  'name: frontend-plugin\nrole: frontend-plugin\n',
              },
            },
          },
        },
        'my-package': {
          'template.yaml': 'name: backend-plugin\nrole: backend-plugin\n',
        },
      },
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: false,
      templatePointers: [
        {
          name: 'frontend-plugin',
          target: realpathSync(
            mockDir.resolve(
              'node_modules/@my/package/templates/plugin/template.yaml',
            ),
          ),
        },
        {
          name: 'backend-plugin',
          target: realpathSync(
            mockDir.resolve('node_modules/my-package/template.yaml'),
          ),
        },
      ],
      license: 'MIT',
      private: true,
      version: '0.1.0',
      packageNamePrefix: '@acme/',
      packageNamePluginInfix: 'backstage-plugin-',
    });
  });

  it('should use default templates if none are specified', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          cli: {
            new: {
              globals: {
                license: 'MIT',
                private: true,
              },
            },
          },
        },
      }),
      node_modules: Object.fromEntries(
        defaultTemplates.map(t => [
          t,
          { 'template.yaml': `name: x\nrole: web-library\n` },
        ]),
      ),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: defaultTemplates.map(t => ({
        name: 'x',
        target: realpathSync(
          mockDir.resolve(`node_modules/${t}/template.yaml`),
        ),
      })),
      license: 'MIT',
      private: true,
      version: '0.1.0',
      packageNamePrefix: '@internal/',
      packageNamePluginInfix: 'plugin-',
    });
  });

  it('should throw an error if package.json is invalid', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          cli: {
            new: {
              templates: 'invalid',
            },
          },
        },
      }),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).rejects.toThrow(
      /^Failed to load templating configuration from '.*'; caused by Validation error: Expected array/,
    );
  });

  it('should throw an error if built-in template does not exist', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          cli: {
            new: {
              templates: ['./invalid'],
            },
          },
        },
      }),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).rejects.toThrow(
      `Failed to load template definition '.\/invalid'; caused by Error: ENOENT`,
    );
  });

  it('should handle missing backstage.new configuration', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({}),
      node_modules: Object.fromEntries(
        defaultTemplates.map(t => [
          t,
          { 'template.yaml': `name: x\nrole: web-library\n` },
        ]),
      ),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: expect.any(Array),
      license: 'Apache-2.0',
      version: '0.1.0',
      private: true,
      packageNamePrefix: '@internal/',
      packageNamePluginInfix: 'plugin-',
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
        overrides: {
          license: 'nope',
        },
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: expect.any(Array),
      license: 'nope',
      version: '0.1.0',
      private: true,
      packageNamePrefix: '@internal/',
      packageNamePluginInfix: 'plugin-',
    });
  });
});
