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
import * as versioning from '../../../../lib/versioning';
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
    findPaths: () => ({
      resolveTargetRoot(filename: string) {
        return mockDir.resolve(filename);
      },
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

jest.mock('../../../../lib/versioning', () => {
  return {
    fetchPackageInfo: jest.fn(),
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
              name: '@backstage/custom',
              version: '1.0.1',
              backstage: {
                moved: '@backstage-community/custom',
              },
            }),
          },
          'custom-two': {
            'package.json': JSON.stringify({
              name: '@backstage/custom-two',
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

  it('should bump to the moved version when the package is moved and yarn plugin is used', async () => {
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
              name: '@backstage/custom',
              version: '1.0.1',
              backstage: {
                moved: '@backstage-community/custom',
              },
            }),
          },
          'custom-two': {
            'package.json': JSON.stringify({
              name: '@backstage/custom-two',
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
              '@backstage/core': 'backstage:^',
              '@backstage/custom': 'backstage:^',
              '@backstage/custom-two': 'backstage:^',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': 'backstage:^',
              '@backstage/theme': 'backstage:^',
              '@backstage/custom': 'backstage:^',
              '@backstage/custom-two': 'backstage:^',
            },
          }),
        },
      },
    });

    jest.spyOn(run, 'run').mockResolvedValue(undefined);
    jest
      .spyOn(versioning, 'fetchPackageInfo')
      .mockImplementation(async (pkgName: string) => {
        const version: string =
          pkgName === '@backstage-community/custom' ? '1.0.1' : '1.0.0';
        return {
          name: pkgName,
          'dist-tags': {
            latest: version,
          },
          versions: [version],
          time: {
            [version]: new Date().toISOString(),
          },
        };
      });

    const { warn, log: logs } = await withLogCollector(async () => {
      await migrate({});
    });

    expectLogsToMatch(logs, [
      'Checking for moved packages to the @backstage-community namespace...',
      'Found a moved package @backstage/custom@backstage:^ -> @backstage-community/custom in a (dependencies)',
      'Found a moved package @backstage/custom-two@backstage:^ -> @backstage-community/custom-two in a (dependencies)',
      'Found a moved package @backstage/custom@backstage:^ -> @backstage-community/custom in b (dependencies)',
      'Found a moved package @backstage/custom-two@backstage:^ -> @backstage-community/custom-two in b (dependencies)',
    ]);

    expectLogsToMatch(warn, [
      'Could not find package.json for @backstage/core@backstage:^ in a (dependencies)',
      'Could not find package.json for @backstage/core@backstage:^ in b (dependencies)',
      'Could not find package.json for @backstage/theme@backstage:^ in b (dependencies)',
    ]);

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
        '@backstage/core': 'backstage:^',
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage-community/custom': '^1.0.1',
        '@backstage-community/custom-two': '^1.0.0',
        '@backstage/core': 'backstage:^',
        '@backstage/theme': 'backstage:^',
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

  it('should replace the occurrences of the package moved within the @backstage namespace', async () => {
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
              name: '@backstage/custom',
              version: '2.0.0',
              backstage: {
                moved: '@backstage/custom-two',
              },
            }),
          },
          'custom-two': {
            'package.json': JSON.stringify({
              name: '@backstage/custom-two',
              version: '3.0.0',
            }),
          },
        },
      },
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/custom': '^2.0.0',
            },
          }),
          src: {
            'index.ts': "import { myThing } from '@backstage/custom';",
          },
        },
      },
    });

    jest.spyOn(run, 'run').mockResolvedValue(undefined);

    const { log: logs, warn } = await withLogCollector(async () => {
      await migrate({});
    });

    expectLogsToMatch(logs, [
      'Checking for moved packages to the @backstage-community namespace...',
      'Found a moved package @backstage/custom@^2.0.0 -> @backstage/custom-two in a (dependencies)',
      'Updated 1 files in a to use the new package names',
    ]);
    expect(warn.length).toBe(0);

    expect(run.run).toHaveBeenCalledTimes(1);
    expect(run.run).toHaveBeenCalledWith(
      'yarn',
      ['install'],
      expect.any(Object),
    );

    const pkgJson = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );
    expect(pkgJson).toEqual({
      name: 'a',
      dependencies: {
        '@backstage/custom-two': '^2.0.0',
      },
    });

    const indexSource = await fs.readFile(
      mockDir.resolve('packages/a/src/index.ts'),
      'utf-8',
    );
    expect(indexSource).toBe(
      "import { myThing } from '@backstage/custom-two';",
    );
  });
});
