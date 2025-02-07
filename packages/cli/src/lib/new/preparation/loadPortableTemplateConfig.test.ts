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
          new: {
            templates: [
              { id: 'template1', target: 'path/to/template1' },
              { id: 'template2', target: 'path/to/template2' },
            ],
            globals: {
              license: 'MIT',
              private: true,
            },
          },
        },
      }),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: false,
      templatePointers: [
        { id: 'template1', target: 'path/to/template1' },
        { id: 'template2', target: 'path/to/template2' },
      ],
      globals: {
        license: 'MIT',
        private: true,
        baseVersion: '0.1.0',
      },
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
        globalOverrides: {
          license: 'nope',
          private: false,
        },
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: false,
      templatePointers: [
        { id: 'template1', target: 'path/to/template1' },
        { id: 'template2', target: 'path/to/template2' },
      ],
      globals: {
        license: 'nope',
        private: false,
        baseVersion: '0.1.0',
      },
    });
  });

  it('should use default templates if none are specified', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          new: {
            globals: {
              license: 'MIT',
              private: true,
            },
          },
        },
      }),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: defaultTemplates,
      globals: {
        license: 'MIT',
        private: true,
        baseVersion: '0.1.0',
      },
    });
  });

  it('should throw an error if package.json is invalid', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          new: {
            templates: 'invalid',
          },
        },
      }),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).rejects.toThrow(
      /^Failed to load templating configuration from '.*'; caused by Validation error/,
    );
  });

  it('should handle missing backstage.new configuration', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({}),
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: defaultTemplates,
      globals: {
        license: 'Apache-2.0',
        baseVersion: '0.1.0',
        private: true,
      },
    });

    await expect(
      loadPortableTemplateConfig({
        packagePath: mockDir.resolve('package.json'),
        globalOverrides: {
          license: 'nope',
        },
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: defaultTemplates,
      globals: {
        license: 'nope',
        baseVersion: '0.1.0',
        private: true,
      },
    });
  });
});
