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

import { loadConfig } from './loadConfig';
import { defaultTemplates } from '../defaultTemplates';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('loadConfig', () => {
  const mockPkgJson = {
    backstage: {
      new: {
        templates: [
          { id: 'template1', target: 'path/to/template1' },
          { id: 'template2', target: 'path/to/template2' },
        ],
        globals: {
          key1: 'value1',
          key2: 2,
          key3: true,
        },
      },
    },
  };

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
              key1: 'value1',
              key2: 2,
              key3: true,
            },
          },
        },
      }),
    });

    await expect(
      loadConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: false,
      templatePointers: mockPkgJson.backstage.new.templates,
      globals: {
        key1: 'value1',
        key2: 2,
        key3: true,
      },
    });

    await expect(
      loadConfig({
        packagePath: mockDir.resolve('package.json'),
        globalOverrides: {
          key2: 'override',
          key4: 'override2',
        },
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: false,
      templatePointers: mockPkgJson.backstage.new.templates,
      globals: {
        key1: 'value1',
        key2: 'override',
        key3: true,
        key4: 'override2',
      },
    });
  });

  it('should use default templates if none are specified', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        backstage: {
          new: {
            globals: {
              key1: 'value1',
              key2: 2,
              key3: true,
            },
          },
        },
      }),
    });

    await expect(
      loadConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: defaultTemplates,
      globals: {
        key1: 'value1',
        key2: 2,
        key3: true,
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
      loadConfig({
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
      loadConfig({
        packagePath: mockDir.resolve('package.json'),
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: defaultTemplates,
      globals: {},
    });

    await expect(
      loadConfig({
        packagePath: mockDir.resolve('package.json'),
        globalOverrides: {
          key: 'override',
        },
      }),
    ).resolves.toEqual({
      isUsingDefaultTemplates: true,
      templatePointers: defaultTemplates,
      globals: {
        key: 'override',
      },
    });
  });
});
