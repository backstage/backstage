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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { loadTemplate } from './loadTemplate';

describe('loadTemplate', () => {
  it('should load a valid template', async () => {
    const mockDir = createMockDirectory({
      content: {
        'path/to/template1.yaml': `
          template: template1
          targetPath: plugins
          role: frontend-plugin
        `,
        'path/to/template1/hello.txt': 'hello world',
      },
    });

    const result = await loadTemplate({
      id: 'template1',
      target: mockDir.resolve('path/to/template1.yaml'),
    });

    expect(result).toEqual({
      id: 'template1',
      templatePath: mockDir.resolve('path/to/template1'),
      targetPath: 'plugins',
      role: 'frontend-plugin',
    });
  });

  it('should throw an error if template file does not exist', async () => {
    const mockDir = createMockDirectory();

    await expect(
      loadTemplate({
        id: 'template1',
        target: mockDir.resolve('path/to/template1.yaml'),
      }),
    ).rejects.toThrow(
      /^Failed to load template definition from '.*'; caused by Error: ENOENT/,
    );
  });

  it('should throw an error if template definition is invalid', async () => {
    const mockDir = createMockDirectory({
      content: {
        'path/to/template1.yaml': `invalid: definition`,
      },
    });

    await expect(
      loadTemplate({
        id: 'template1',
        target: mockDir.resolve('path/to/template1.yaml'),
      }),
    ).rejects.toThrow(
      /Invalid template definition at '.*'; caused by Validation error/,
    );
  });

  it('should throw an error if target is a remote URL', async () => {
    await expect(
      loadTemplate({
        id: 'template1',
        target: 'http://example.com',
      }),
    ).rejects.toThrow('Remote templates are not supported yet');
  });

  it('should throw an error if target directory does not exist', async () => {
    await expect(
      loadTemplate({
        id: 'template1',
        target: 'http://example.com',
      }),
    ).rejects.toThrow('Remote templates are not supported yet');
  });

  it('should throw an error if the package role is invalid', async () => {
    const mockDir = createMockDirectory({
      content: {
        'path/to/template1.yaml': `
          template: template1
          targetPath: plugins
          role: invalid-role
        `,
      },
    });

    await expect(
      loadTemplate({
        id: 'template1',
        target: mockDir.resolve('path/to/template1.yaml'),
      }),
    ).rejects.toThrow(
      `Failed to load template contents from '${mockDir.resolve(
        'path/to/template1',
      )}'; caused by Error: Unknown package role 'invalid-role'`,
    );
  });

  it('should throw an error if template directory does not exist', async () => {
    const mockDir = createMockDirectory({
      content: {
        'path/to/template1.yaml': `
          template: template1
          targetPath: plugins
          role: frontend-plugin
        `,
      },
    });

    await expect(
      loadTemplate({
        id: 'template1',
        target: mockDir.resolve('path/to/template1.yaml'),
      }),
    ).rejects.toThrow(
      `Failed to load template contents from '${mockDir.resolve(
        'path/to/template1',
      )}'; caused by Error: Template directory does not exist`,
    );
  });
});
