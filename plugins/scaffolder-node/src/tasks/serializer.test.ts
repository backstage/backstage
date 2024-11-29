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

import { serializeWorkspace, restoreWorkspace } from './serializer';
import { createMockDirectory } from '@backstage/backend-test-utils';
import fs from 'fs-extra';

describe('serializer', () => {
  const workspaceDir = createMockDirectory({
    content: {
      'app-config.yaml': `
            app:
              title: Example App
              sessionKey:
                $file: secrets/session-key.txt
              escaped: \$\${Escaped}
          `,
      'app-config2.yaml': `
            app:
              title: Example App 2
              sessionKey:
                $file: secrets/session-key.txt
              escaped: \$\${Escaped}
          `,
      'app-config.development.yaml': `
            app:
              sessionKey: development-key
            backend:
              $include: ./included.yaml
            other:
              $include: secrets/included.yaml
          `,
      'secrets/session-key.txt': 'abc123',
      'secrets/included.yaml': `
            secret:
              $file: session-key.txt
          `,
      'included.yaml': `
            foo:
              bar: token \${MY_SECRET}
          `,
      'app-config.substitute.yaml': `
            app:
              someConfig:
                $include: \${SUBSTITUTE_ME}.yaml
              noSubstitute:
                $file: \$\${ESCAPE_ME}.txt
          `,
      'substituted.yaml': `
            secret:
              $file: secrets/\${SUBSTITUTE_ME}.txt
          `,
      'secrets/substituted.txt': '123abc',
      '${ESCAPE_ME}.txt': 'notSubstituted',
      'empty.yaml': '# just a comment',
    },
  });

  const restoredWorkspaceDir = createMockDirectory();

  it('should be able to archive and restore the workspace', async () => {
    const workspaceBuffer = await serializeWorkspace(workspaceDir);
    await restoreWorkspace({
      path: restoredWorkspaceDir.path,
      buffer: workspaceBuffer.contents,
    });

    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/\$\{ESCAPE_ME\}.txt`),
    ).toBeTruthy();
    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/app-config.development.yaml`),
    ).toBeTruthy();
    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/app-config.substitute.yaml`),
    ).toBeTruthy();
    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/app-config.yaml`),
    ).toBeTruthy();
    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/app-config2.yaml`),
    ).toBeTruthy();
    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/empty.yaml`),
    ).toBeTruthy();
    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/included.yaml`),
    ).toBeTruthy();
    expect(fs.existsSync(`${restoredWorkspaceDir.path}/secrets`)).toBeTruthy();
    expect(
      fs.existsSync(`${restoredWorkspaceDir.path}/substituted.yaml`),
    ).toBeTruthy();

    expect(
      fs.readFileSync(`${restoredWorkspaceDir.path}/substituted.yaml`, 'utf8'),
    ).toEqual(`
            secret:
              $file: secrets/\${SUBSTITUTE_ME}.txt
          `);
  });
});
