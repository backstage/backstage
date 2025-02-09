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
import { loadPortableTemplate } from './loadPortableTemplate';

describe('loadTemplate', () => {
  it('should load a valid template', async () => {
    const mockDir = createMockDirectory({
      content: {
        'path/to/template1.yaml': `
          template: template1
          role: frontend-plugin
        `,
        'path/to/template1/hello.txt': 'hello world',
      },
    });

    const result = await loadPortableTemplate({
      id: 'template1',
      target: mockDir.resolve('path/to/template1.yaml'),
    });

    expect(result).toEqual({
      id: 'template1',
      role: 'frontend-plugin',
      files: [{ path: 'hello.txt', content: 'hello world' }],
      templateValues: {},
    });
  });

  it('should throw an error if template file does not exist', async () => {
    const mockDir = createMockDirectory();

    await expect(
      loadPortableTemplate({
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
      loadPortableTemplate({
        id: 'template1',
        target: mockDir.resolve('path/to/template1.yaml'),
      }),
    ).rejects.toThrow(
      /Invalid template definition at '.*'; caused by Validation error/,
    );
  });

  it('should throw an error if target is a remote URL', async () => {
    await expect(
      loadPortableTemplate({
        id: 'template1',
        target: 'http://example.com',
      }),
    ).rejects.toThrow('Remote templates are not supported yet');
  });

  it('should throw an error if target directory does not exist', async () => {
    await expect(
      loadPortableTemplate({
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
          role: invalid-role
        `,
      },
    });

    await expect(
      loadPortableTemplate({
        id: 'template1',
        target: mockDir.resolve('path/to/template1.yaml'),
      }),
    ).rejects.toThrow(
      `Invalid template definition at '${mockDir.resolve(
        'path/to/template1.yaml',
      )}'; caused by Validation error: Invalid enum value`,
    );
  });

  it('should throw an error if template directory does not exist', async () => {
    const mockDir = createMockDirectory({
      content: {
        'path/to/template1.yaml': `
          template: template1
          role: frontend-plugin
        `,
      },
    });

    await expect(
      loadPortableTemplate({
        id: 'template1',
        target: mockDir.resolve('path/to/template1.yaml'),
      }),
    ).rejects.toThrow(
      `Failed to load template contents from '${mockDir.resolve(
        'path/to/template1',
      )}'`,
    );
  });
});
