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
import { mockPaths } from './testUtils';
import {
  executePluginPackageTemplate,
  templatingTask,
} from './executePluginPackageTemplate';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('executePluginPackageTemplate', () => {
  const mockDir = createMockDirectory();
  mockPaths({
    ownDir: mockDir.resolve('own'),
    targetRoot: mockDir.resolve('root'),
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should execute template', async () => {
    mockDir.setContent({
      root: {
        'yarn.lock': `
some-package@^1.1.0:
  version "1.5.0"
`,
      },
      own: {
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
    });

    let modified = false;
    await executePluginPackageTemplate(
      {
        isMonoRepo: false,
        createTemporaryDirectory: (name: string) => fs.mkdtemp(name),
        markAsModified: () => {
          modified = true;
        },
      },
      {
        templateDir: mockDir.resolve('own', 'test-template'),
        targetDir: mockDir.resolve('target'),
        values: {
          id: 'testing',
        },
      },
    );

    expect(modified).toBe(true);

    await expect(fs.readFile(mockDir.resolve('target/package.json'), 'utf8'))
      .resolves.toBe(`{
  "name": "my-testing-plugin",
  "description": "testing",
  "dependencies": {
    "some-package": "^1.1.0",
    "other-package": "^2.3.0"
  }
}
`);
    await expect(
      fs.readFile(mockDir.resolve('target/subdir/templated.txt'), 'utf8'),
    ).resolves.toBe('Hello testing!');
    await expect(
      fs.readFile(mockDir.resolve('target/subdir/not-templated.txt'), 'utf8'),
    ).resolves.toBe('Hello {{id}}!');
  });
});

describe('templatingTask', () => {
  const mockDir = createMockDirectory();

  it('should template a directory with mix of regular files and templates', async () => {
    // Testing template directory
    const tmplDir = 'test-tmpl';

    // Temporary dest dir to write the template to
    const destDir = 'test-dest';

    // Files content
    const testFileContent = 'testing';
    const testVersionFileContent =
      "version: {{pluginVersion}} {{versionQuery 'mock-pkg'}}";

    mockDir.setContent({
      [tmplDir]: {
        sub: {
          'version.txt.hbs': testVersionFileContent,
        },
        'test.txt': testFileContent,
      },
      [destDir]: {},
    });

    await templatingTask(
      mockDir.resolve(tmplDir),
      mockDir.resolve(destDir),
      {
        pluginVersion: '0.0.0',
      },
      () => '^0.1.2',
      true,
    );

    await expect(
      fs.readFile(mockDir.resolve(destDir, 'test.txt'), 'utf8'),
    ).resolves.toBe(testFileContent);
    await expect(
      fs.readFile(mockDir.resolve(destDir, 'sub/version.txt'), 'utf8'),
    ).resolves.toBe('version: 0.0.0 ^0.1.2');
  });
});
