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
import * as runObj from '@backstage/cli-common';
import migrate from './migrate';
import { withLogCollector } from '@backstage/test-utils';
import fs from 'fs-extra';

// Remove log coloring to simplify log matching
jest.mock('chalk', () => ({
  red: (str: string) => str,
  blue: (str: string) => str,
  cyan: (str: string) => str,
  green: (str: string) => str,
  magenta: (str: string) => str,
  yellow: (str: string) => str,
}));

let mockDir: MockDirectory;
jest.mock('@backstage/cli-common', () => {
  const actual = jest.requireActual('@backstage/cli-common');
  return {
    ...actual,
    targetPaths: {
      resolve: (...args: string[]) => mockDir.resolve(...args),
      resolveRoot: (...args: string[]) => mockDir.resolve(...args),
    },
    findPaths: () => ({
      resolveTargetRoot: (...args: string[]) => mockDir.resolve(...args),
      get targetDir() {
        return mockDir.path;
      },
    }),
    run: jest.fn().mockReturnValue({
      exitCode: null,
      waitForExit: jest.fn().mockResolvedValue(undefined),
    }),
  };
});

function expectLogsToMatch(receivedLogs: String[], expected: String[]): void {
  expect(receivedLogs.filter(Boolean).sort()).toEqual(expected.sort());
}

describe('versions:migrate', () => {
  mockDir = createMockDirectory();

  beforeEach(() => {
    (runObj.run as jest.Mock).mockReturnValue({
      exitCode: null,
      waitForExit: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    (runObj.run as jest.Mock).mockClear();
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

    const { warn, log: logs } = await withLogCollector(async () => {
      await migrate({});
    });

    expectLogsToMatch(logs, [
      'Checking for moved packages to the @backstage-community namespace...',
      'Found a moved package @backstage/custom@^1.0.1 -> @backstage-community/custom in a (dependencies)',
      'Found a moved package @backstage/custom-two@^1.0.0 -> @backstage-community/custom-two in a (dependencies)',
      'Found a moved package @backstage/custom@^1.1.0 -> @backstage-community/custom in b (dependencies)',
      'Found a moved package @backstage/custom-two@^1.0.0 -> @backstage-community/custom-two in b (dependencies)',
    ]);

    expectLogsToMatch(warn, [
      'Could not find package.json for @backstage/core@^1.0.5 in a (dependencies)',
      'Could not find package.json for @backstage/core@^1.0.3 in b (dependencies)',
      'Could not find package.json for @backstage/theme@^1.0.0 in b (dependencies)',
    ]);

    expect(runObj.run).toHaveBeenCalledTimes(1);
    expect(runObj.run).toHaveBeenCalledWith(
      ['yarn', 'install'],
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

  it('should replace the occurrences of the moved package in files inside the correct package', async () => {
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
          src: {
            'index.ts': "import { myThing } from '@backstage/custom';",
            'index.test.ts': "import { myThing } from '@backstage/custom-two';",
          },
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

    await withLogCollector(async () => {
      await migrate({});
    });

    expect(runObj.run).toHaveBeenCalledTimes(1);
    expect(runObj.run).toHaveBeenCalledWith(
      ['yarn', 'install'],
      expect.any(Object),
    );

    const indexA = await fs.readFile(
      mockDir.resolve('packages/a/src/index.ts'),
      'utf-8',
    );

    expect(indexA).toEqual(
      "import { myThing } from '@backstage-community/custom';",
    );

    const indexTestA = await fs.readFile(
      mockDir.resolve('packages/a/src/index.test.ts'),
      'utf-8',
    );

    expect(indexTestA).toEqual(
      "import { myThing } from '@backstage-community/custom-two';",
    );
  });

  it('should replace occurrences of changed packages, and is careful', async () => {
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
          src: {
            'index.ts': "import { myThing } from '@backstage/custom';",
            'index.test.ts': "import { myThing } from '@backstage/custom-two';",
          },
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

    await withLogCollector(async () => {
      await migrate({});
    });

    expect(runObj.run).toHaveBeenCalledTimes(1);
    expect(runObj.run).toHaveBeenCalledWith(
      ['yarn', 'install'],
      expect.any(Object),
    );

    const indexA = await fs.readFile(
      mockDir.resolve('packages/a/src/index.ts'),
      'utf-8',
    );

    expect(indexA).toEqual(
      "import { myThing } from '@backstage-community/custom';",
    );

    const indexTestA = await fs.readFile(
      mockDir.resolve('packages/a/src/index.test.ts'),
      'utf-8',
    );

    expect(indexTestA).toEqual(
      "import { myThing } from '@backstage/custom-two';",
    );
  });
});
