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

import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { createMockOutputStream, mockPaths } from './testUtils';
import { CreateContext } from '../../types';
import { executePluginPackageTemplate } from './tasks';

mockPaths({
  ownDir: '/own',
  targetRoot: '/root',
});

describe('executePluginPackageTemplate', () => {
  afterEach(() => {
    mockFs.restore();
    jest.resetAllMocks();
  });

  it('should execute template', async () => {
    mockFs({
      '/root': {
        'yarn.lock': `
some-package@^1.1.0:
  version "1.5.0"
`,
      },
      '/own': {
        templates: {
          'test-template': {
            'package.json.hbs': `
{
  "name": "my-{{id}}-plugin",
  {{#if makePrivate}}
    "private": true,
  {{/if}}
  "description": "testing",
  "dependencies": {
    "some-package": "{{ versionQuery 'some-package' '1.3.0' }}",
    "other-package": "{{ versionQuery 'other-package' '2.3.0' }}"
  }
}
`,
            subdir: {
              'templated.txt.hbs': 'Hello {{id}}!',
              'not-templated.txt': 'Hello {{id}}!',
            },
          },
        },
      },
    });

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);

    let modified = false;
    await executePluginPackageTemplate(
      {
        createTemporaryDirectory: (name: string) => fs.mkdtemp(name),
        markAsModified: () => {
          modified = true;
        },
      } as CreateContext,
      {
        templateName: 'test-template',
        targetDir: '/target',
        values: {
          id: 'testing',
          makePrivate: true,
        },
      },
    );

    expect(modified).toBe(true);
    expect(output).toEqual([
      'Checking Prerequisites:',
      'availability  /target ✔',
      'creating      temp dir ✔',
      'Executing Template:',
      'templating    package.json.hbs ✔',
      'copying       not-templated.txt ✔',
      'templating    templated.txt.hbs ✔',
      'Installing:',
      'moving        /target ✔',
    ]);
    await expect(fs.readFile('/target/package.json', 'utf8')).resolves.toBe(`{
  "name": "my-testing-plugin",
  "private": true,
  "description": "testing",
  "dependencies": {
    "some-package": "^1.1.0",
    "other-package": "^2.3.0"
  }
}
`);
    await expect(
      fs.readFile('/target/subdir/templated.txt', 'utf8'),
    ).resolves.toBe('Hello testing!');
    await expect(
      fs.readFile('/target/subdir/not-templated.txt', 'utf8'),
    ).resolves.toBe('Hello {{id}}!');
  });
});
