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
import { writeTemplateContents } from './writeTemplateContents';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { paths } from '../../paths';

const baseConfig = {
  version: '0.1.0',
  license: 'Apache-2.0',
  private: true,
};

describe('writeTemplateContents', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockDir.clear();
    jest.resetAllMocks();
    jest
      .spyOn(paths, 'resolveTargetRoot')
      .mockImplementation((...args) => mockDir.resolve(...args));
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
    expect(mockDir.content()).toEqual({});
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
      out: {
        'test.txt': 'test',
        'plugin.txt': 'id=test',
        'test.json': '{"x":1}',
      },
    });
  });
});
