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
import {
  MockDirectory,
  createMockDirectory,
} from '@backstage/backend-test-utils';
import * as run from '../../lib/run';
import migrate from './migrate';
import { withLogCollector } from '@backstage/test-utils';
import { paths } from '../../lib/paths';
import fs from 'fs-extra';

let mockDir: MockDirectory;
jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  findPaths: () => ({
    resolveTargetRoot(filename: string) {
      return mockDir.resolve(filename);
    },
    get targetDir() {
      console.log('calling!');
      return mockDir.path;
    },
  }),
}));

jest.mock('../../lib/run', () => {
  return {
    run: jest.fn(),
  };
});

describe('versions:migrate', () => {
  mockDir = createMockDirectory();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should bump to the moved version when the package is moved', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      node_modules: {
        '@backstage': {
          custom: {
            'package.json': JSON.stringify({
              name: '@backstage-extra/custom',
              version: '1.0.1',
              backstage: {
                moved: '@backstage-community/custom',
              },
            }),
          },
          'custom-two': {
            'package.json': JSON.stringify({
              name: '@backstage-extra/custom-two',
              version: '1.0.0',
              backstage: {
                moved: '@backstage-community/custom-two',
              },
            }),
          },
        },
      },
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
              '@backstage/custom': '^1.0.1',
              '@backstage/custom-two': '^1.0.0',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^1.0.0',
              '@backstage/custom': '^1.1.0',
              '@backstage/custom-two': '^1.0.0',
            },
          }),
        },
      },
    });

    jest.spyOn(run, 'run').mockResolvedValue(undefined);
    await migrate({});

    const { log: logs } = await withLogCollector(['log'], async () => {});
    // expectLogsToMatch(logs, [
    //   'Checking for updates of @backstage/core',
    //   'Checking for updates of @backstage/custom',
    //   'Checking for updates of @backstage/custom-two',
    //   'Checking for updates of @backstage/theme',
    //   'Checking for updates of @backstage/core-api',
    //   'Some packages are outdated, updating',
    //   'Using default pattern glob @backstage?(-community)/*',
    //   'unlocking @backstage/core@^1.0.3 ~> 1.0.6',
    //   'unlocking @backstage-community/custom@^1.0.1 ~> 1.1.0',
    //   'unlocking @backstage/core-api@^1.0.6 ~> 1.0.7',
    //   'unlocking @backstage/core-api@^1.0.3 ~> 1.0.7',
    //   'bumping @backstage/core in a to ^1.0.6',
    //   'bumping @backstage-community/custom in a to ^1.1.0',
    //   'bumping @backstage-community/custom-two in a to ^2.0.0',
    //   'bumping @backstage/core in b to ^1.0.6',
    //   'bumping @backstage-community/custom in b to ^1.1.0',
    //   'bumping @backstage-community/custom-two in b to ^2.0.0',
    //   'bumping @backstage/theme in b to ^2.0.0',
    //   'Running yarn install to install new versions',
    //   '⚠️  The following packages may have breaking changes:',
    //   '  @backstage-community/custom-two : 1.0.0 ~> 2.0.0',
    //   '  @backstage/theme : 1.0.0 ~> 2.0.0',
    //   '    https://github.com/backstage/backstage/blob/master/packages/theme/CHANGELOG.md',
    //   'Version bump complete!',
    // ]);

    expect(run.run).toHaveBeenCalledTimes(1);
    expect(run.run).toHaveBeenCalledWith(
      'yarn',
      ['install'],
      expect.any(Object),
    );

    const packageA = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );

    expect(packageA).toEqual({
      name: 'a',
      dependencies: {
        '@backstage-community/custom': '^1.0.1',
        '@backstage-community/custom-two': '^1.0.0',
        '@backstage/core': '^1.0.5',
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage-community/custom': '^1.1.0',
        '@backstage-community/custom-two': '^1.0.0',
        '@backstage/core': '^1.0.3',
        '@backstage/theme': '^1.0.0',
      },
    });
  });
});
