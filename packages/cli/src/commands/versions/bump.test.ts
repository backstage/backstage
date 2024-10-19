/*
 * Copyright 2020 The Backstage Authors
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
import { Command } from 'commander';
import bump, { bumpBackstageJsonVersion, createVersionFinder } from './bump';
import { registerMswTestHooks, withLogCollector } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { NotFoundError } from '@backstage/errors';
import {
  MockDirectory,
  createMockDirectory,
} from '@backstage/backend-test-utils';
import { LockfileEntry, PackageInfo } from '@backstage/cli-node';

// Avoid mutating the global http(s) agent used in other tests
jest.mock('global-agent/bootstrap', () => {});

// Remove log coloring to simplify log matching
jest.mock('chalk', () => ({
  red: (str: string) => str,
  blue: (str: string) => str,
  cyan: (str: string) => str,
  green: (str: string) => str,
  magenta: (str: string) => str,
  yellow: (str: string) => str,
}));

jest.mock('ora', () => ({
  __esModule: true,
  default({ prefixText }: any) {
    console.log(prefixText);
    return {
      start: () => ({
        succeed: () => {},
        fail: () => {},
      }),
    };
  },
}));

let mockDir: MockDirectory;
jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  findPaths: () => ({
    resolveTargetRoot(filename: string) {
      return mockDir.resolve(filename);
    },
    get targetDir() {
      return mockDir.path;
    },
  }),
}));

const LOCKFILE_PACKAGES: Map<string, LockfileEntry[]> = new Map([
  [
    '@backstage/core',
    [
      {
        range: '^1.0.5',
        version: '1.0.6',
      },
      {
        range: '^1.0.3',
        version: '1.0.3',
      },
    ],
  ],
  [
    '@backstage/theme',
    [
      {
        range: '^1.0.0',
        version: '1.0.0',
      },
    ],
  ],
  [
    '@backstage/core-api',
    [
      {
        range: '^1.0.6',
        version: '1.0.6',
      },
      {
        range: '^1.0.3',
        version: '1.0.3',
      },
    ],
  ],
]);

const mockRun = jest.fn();
const mockFetchPackageInfo = jest.fn();
const mockLoadLockfile = jest.fn();
jest.mock('@backstage/cli-node', () => {
  return {
    ...jest.requireActual('@backstage/cli-node'),
    PackageGraph: {
      listTargetPackages: async () => {
        return [];
      },
    },
    detectPackageManager: () => {
      return {
        name: () => 'mock',
        fetchPackageInfo: mockFetchPackageInfo,
        run: mockRun,
        loadLockfile: mockLoadLockfile,
        supportsBackstageVersionProtocol: jest.fn(),
      };
    },
  };
});

const REGISTRY_VERSIONS: { [name: string]: string } = {
  '@backstage/core': '1.0.6',
  '@backstage/core-api': '1.0.7',
  '@backstage/theme': '2.0.0',
  '@backstage-extra/custom': '1.1.0',
  '@backstage-extra/custom-two': '2.0.0',
  '@backstage/create-app': '1.0.0',
};

// Avoid flakes by comparing sorted log lines. File system access is async, which leads to the log line order being indeterministic
const expectLogsToMatch = (
  recievedLogs: String[],
  expected: String[],
): void => {
  expect(recievedLogs.filter(Boolean).sort()).toEqual(expected.sort());
};

describe('bump', () => {
  mockDir = createMockDirectory();

  beforeEach(() => {
    mockFetchPackageInfo.mockImplementation(async name => ({
      name: name,
      'dist-tags': {
        latest: REGISTRY_VERSIONS[name],
      },
    }));

    mockLoadLockfile.mockImplementation(async () => {
      return {
        get: (name: string) => LOCKFILE_PACKAGES.get(name),
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const worker = setupServer();
  registerMswTestHooks(worker);

  it('should bump backstage dependencies', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^1.0.0',
            },
          }),
        },
      },
    });

    worker.use(
      rest.get(
        'https://versions.backstage.io/v1/tags/main/manifest.json',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              packages: [],
            }),
          ),
      ),
    );
    const { log: logs } = await withLogCollector(['log', 'warn'], async () => {
      await bump({ pattern: null, release: 'main' } as unknown as Command);
    });
    expectLogsToMatch(logs, [
      'Using default pattern glob @backstage/*',
      'Checking for updates of @backstage/core',
      'Checking for updates of @backstage/theme',
      'Some packages are outdated, updating',
      'bumping @backstage/core in a to ^1.0.6',
      'bumping @backstage/core in b to ^1.0.6',
      'bumping @backstage/theme in b to ^2.0.0',
      'Running mock install to install new versions',
      'Checking for moved packages to the @backstage-community namespace...',
      '⚠️  The following packages may have breaking changes:',
      '  @backstage/theme : 1.0.0 ~> 2.0.0',
      '    https://github.com/backstage/backstage/blob/master/packages/theme/CHANGELOG.md',
      'Version bump complete!',
    ]);

    expect(mockFetchPackageInfo).toHaveBeenCalledTimes(2);
    expect(mockFetchPackageInfo).toHaveBeenCalledWith('@backstage/core');
    expect(mockFetchPackageInfo).toHaveBeenCalledWith('@backstage/theme');

    expect(mockRun).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledWith(['install'], expect.any(Object));

    const packageA = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );
    expect(packageA).toEqual({
      name: 'a',
      dependencies: {
        '@backstage/core': '^1.0.6',
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage/core': '^1.0.6',
        '@backstage/theme': '^2.0.0',
      },
    });
  });

  it('should bump backstage dependencies but not install them', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^1.0.0',
            },
          }),
        },
      },
    });

    worker.use(
      rest.get(
        'https://versions.backstage.io/v1/tags/main/manifest.json',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              packages: [],
            }),
          ),
      ),
    );
    const { log: logs } = await withLogCollector(['log', 'warn'], async () => {
      await bump({
        pattern: null,
        release: 'main',
        skipInstall: true,
      } as unknown as Command);
    });
    expectLogsToMatch(logs, [
      'Using default pattern glob @backstage/*',
      'Checking for updates of @backstage/core',
      'Checking for updates of @backstage/theme',
      'Some packages are outdated, updating',
      'bumping @backstage/core in a to ^1.0.6',
      'bumping @backstage/core in b to ^1.0.6',
      'bumping @backstage/theme in b to ^2.0.0',
      'Skipping mock install',
      'Checking for moved packages to the @backstage-community namespace...',
      '⚠️  The following packages may have breaking changes:',
      '  @backstage/theme : 1.0.0 ~> 2.0.0',
      '    https://github.com/backstage/backstage/blob/master/packages/theme/CHANGELOG.md',
      'Version bump complete!',
    ]);

    expect(mockFetchPackageInfo).toHaveBeenCalledTimes(2);
    expect(mockFetchPackageInfo).toHaveBeenCalledWith('@backstage/core');
    expect(mockFetchPackageInfo).toHaveBeenCalledWith('@backstage/theme');

    expect(mockRun).not.toHaveBeenCalledWith(['install'], expect.any(Object));

    const packageA = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );
    expect(packageA).toEqual({
      name: 'a',
      dependencies: {
        '@backstage/core': '^1.0.6',
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage/core': '^1.0.6',
        '@backstage/theme': '^2.0.0',
      },
    });
  });

  it('should prefer dependency versions from release manifest', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^1.0.0',
            },
          }),
        },
      },
    });

    worker.use(
      rest.get(
        'https://versions.backstage.io/v1/tags/main/manifest.json',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              releaseVersion: '0.0.1',
              packages: [
                {
                  name: '@backstage/theme',
                  version: '5.0.0',
                },
                {
                  name: '@backstage/create-app',
                  version: '3.0.0',
                },
              ],
            }),
          ),
      ),
    );
    const { log: logs } = await withLogCollector(['log', 'warn'], async () => {
      await bump({ pattern: null, release: 'main' } as unknown as Command);
    });
    expectLogsToMatch(logs, [
      'Using default pattern glob @backstage/*',
      'Checking for updates of @backstage/core',
      'Checking for updates of @backstage/theme',
      'Some packages are outdated, updating',
      'bumping @backstage/theme in b to ^5.0.0',
      'bumping @backstage/core in b to ^1.0.6',
      'bumping @backstage/core in a to ^1.0.6',
      'Your project is now at version 0.0.1, which has been written to backstage.json',
      'Running mock install to install new versions',
      'Checking for moved packages to the @backstage-community namespace...',
      '⚠️  The following packages may have breaking changes:',
      '  @backstage/theme : 1.0.0 ~> 5.0.0',
      '    https://github.com/backstage/backstage/blob/master/packages/theme/CHANGELOG.md',
      'Version bump complete!',
    ]);

    expect(mockFetchPackageInfo).toHaveBeenCalledTimes(1);
    expect(mockFetchPackageInfo).toHaveBeenCalledWith('@backstage/core');

    expect(mockRun).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledWith(['install'], expect.any(Object));

    const packageA = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );
    expect(packageA).toEqual({
      name: 'a',
      dependencies: {
        '@backstage/core': '^1.0.6',
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage/core': '^1.0.6',
        '@backstage/theme': '^5.0.0',
      },
    });
  });

  it('should only bump packages in the manifest when a specific release is specified', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^1.0.0',
            },
          }),
        },
      },
    });

    worker.use(
      rest.get(
        'https://versions.backstage.io/v1/releases/999.0.1/manifest.json',
        (_, res, ctx) => res(ctx.status(404), ctx.json({})),
      ),
    );
    const { log: logs } = await withLogCollector(['log', 'warn'], async () => {
      await expect(
        bump({ pattern: null, release: '999.0.1' } as unknown as Command),
      ).rejects.toThrow('No release found for 999.0.1 version');
    });
    expect(logs.filter(Boolean)).toEqual([
      'Using default pattern glob @backstage/*',
    ]);

    expect(mockRun).toHaveBeenCalledTimes(0);

    const packageA = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );
    expect(packageA).toEqual({
      name: 'a',
      dependencies: {
        '@backstage/core': '^1.0.5',
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage/core': '^1.0.3',
        '@backstage/theme': '^1.0.0',
      },
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('should prefer versions from the highest manifest version when main is not specified', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^1.0.0',
            },
          }),
        },
      },
    });

    worker.use(
      rest.get(
        'https://versions.backstage.io/v1/tags/main/manifest.json',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              releaseVersion: '1.0.0',
              packages: [
                {
                  name: '@backstage/theme',
                  version: '5.0.0',
                },
                {
                  name: '@backstage/create-app',
                  version: '3.0.0',
                },
              ],
            }),
          ),
      ),
      rest.get(
        'https://versions.backstage.io/v1/tags/next/manifest.json',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              releaseVersion: '1.0.0-next.1',
              packages: [
                {
                  name: '@backstage/theme',
                  version: '4.0.0',
                },
                {
                  name: '@backstage/create-app',
                  version: '2.0.0',
                },
              ],
            }),
          ),
      ),
    );
    const { log: logs } = await withLogCollector(['log', 'warn'], async () => {
      await bump({ pattern: null, release: 'next' } as unknown as Command);
    });
    expectLogsToMatch(logs, [
      'Using default pattern glob @backstage/*',
      'Checking for updates of @backstage/core',
      'Checking for updates of @backstage/theme',
      'Some packages are outdated, updating',
      'bumping @backstage/theme in b to ^5.0.0',
      'bumping @backstage/core in b to ^1.0.6',
      'bumping @backstage/core in a to ^1.0.6',
      'Your project is now at version 1.0.0, which has been written to backstage.json',
      'Running mock install to install new versions',
      'Checking for moved packages to the @backstage-community namespace...',
      '⚠️  The following packages may have breaking changes:',
      '  @backstage/theme : 1.0.0 ~> 5.0.0',
      '    https://github.com/backstage/backstage/blob/master/packages/theme/CHANGELOG.md',
      'Version bump complete!',
    ]);
  });

  it('should bump backstage dependencies and dependencies matching pattern glob', async () => {
    const customLockfilePackages = new Map([
      ...LOCKFILE_PACKAGES,
      [
        '@backstage-extra/custom',
        [
          {
            range: '^1.1.0',
            version: '1.1.0',
          },
          {
            range: '^1.0.1',
            version: '1.0.1',
          },
        ],
      ],
      [
        '@backstage-extra/custom-two',
        [
          {
            range: '^1.0.0',
            version: '1.0.0',
          },
        ],
      ],
    ]);

    mockLoadLockfile.mockImplementation(async () => {
      return {
        get: (name: string) => customLockfilePackages.get(name),
      };
    });

    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
              '@backstage-extra/custom': '^1.0.1',
              '@backstage-extra/custom-two': '^1.0.0',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^1.0.0',
              '@backstage-extra/custom': '^1.1.0',
              '@backstage-extra/custom-two': '^1.0.0',
            },
          }),
        },
      },
    });

    worker.use(
      rest.get(
        'https://versions.backstage.io/v1/tags/main/manifest.json',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              packages: [],
            }),
          ),
      ),
    );
    const { log: logs } = await withLogCollector(['log', 'warn'], async () => {
      await bump({
        pattern: '@{backstage,backstage-extra}/*',
        release: 'main',
      } as any);
    });
    expectLogsToMatch(logs, [
      'Using custom pattern glob @{backstage,backstage-extra}/*',
      'Checking for updates of @backstage/core',
      'Checking for updates of @backstage-extra/custom',
      'Checking for updates of @backstage-extra/custom-two',
      'Checking for updates of @backstage/theme',
      'Some packages are outdated, updating',
      'bumping @backstage/core in a to ^1.0.6',
      'bumping @backstage-extra/custom in a to ^1.1.0',
      'bumping @backstage-extra/custom-two in a to ^2.0.0',
      'bumping @backstage/core in b to ^1.0.6',
      'bumping @backstage-extra/custom in b to ^1.1.0',
      'bumping @backstage-extra/custom-two in b to ^2.0.0',
      'bumping @backstage/theme in b to ^2.0.0',
      'Skipping backstage.json update as custom pattern is used',
      'Running mock install to install new versions',
      'Checking for moved packages to the @backstage-community namespace...',
      '⚠️  The following packages may have breaking changes:',
      '  @backstage-extra/custom-two : 1.0.0 ~> 2.0.0',
      '  @backstage/theme : 1.0.0 ~> 2.0.0',
      '    https://github.com/backstage/backstage/blob/master/packages/theme/CHANGELOG.md',
      'Version bump complete!',
    ]);

    expect(mockFetchPackageInfo).toHaveBeenCalledTimes(4);
    expect(mockFetchPackageInfo).toHaveBeenCalledWith('@backstage/core');
    expect(mockFetchPackageInfo).toHaveBeenCalledWith('@backstage/theme');

    expect(mockRun).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledWith(['install'], expect.any(Object));

    const packageA = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );
    expect(packageA).toEqual({
      name: 'a',
      dependencies: {
        '@backstage-extra/custom': '^1.1.0',
        '@backstage-extra/custom-two': '^2.0.0',
        '@backstage/core': '^1.0.6',
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage-extra/custom': '^1.1.0',
        '@backstage-extra/custom-two': '^2.0.0',
        '@backstage/core': '^1.0.6',
        '@backstage/theme': '^2.0.0',
      },
    });
  });

  it('should ignore not found packages', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': '^1.0.5',
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/core': '^1.0.3',
              '@backstage/theme': '^2.0.0',
            },
          }),
        },
      },
    });

    mockFetchPackageInfo.mockRejectedValue(new NotFoundError('Nope'));
    worker.use(
      rest.get(
        'https://versions.backstage.io/v1/tags/main/manifest.json',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              packages: [],
            }),
          ),
      ),
    );
    const { log: logs } = await withLogCollector(['log', 'warn'], async () => {
      await bump({ pattern: null, release: 'main' } as unknown as Command);
    });
    expectLogsToMatch(logs, [
      'Using default pattern glob @backstage/*',
      'Checking for updates of @backstage/core',
      'Checking for updates of @backstage/theme',
      'Package info not found, ignoring package @backstage/core',
      'Package info not found, ignoring package @backstage/theme',
      'All Backstage packages are up to date!',
    ]);

    expect(mockRun).toHaveBeenCalledTimes(0);

    const packageA = await fs.readJson(
      mockDir.resolve('packages/a/package.json'),
    );
    expect(packageA).toEqual({
      name: 'a',
      dependencies: {
        '@backstage/core': '^1.0.5', // not bumped
      },
    });
    const packageB = await fs.readJson(
      mockDir.resolve('packages/b/package.json'),
    );
    expect(packageB).toEqual({
      name: 'b',
      dependencies: {
        '@backstage/core': '^1.0.3', // not bumped
        '@backstage/theme': '^2.0.0', // not bumped
      },
    });
  });
});

describe('bumpBackstageJsonVersion', () => {
  mockDir = createMockDirectory();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should bump version in backstage.json', async () => {
    mockDir.setContent({
      'backstage.json': JSON.stringify({ version: '0.0.1' }),
    });

    const { log } = await withLogCollector(async () => {
      await bumpBackstageJsonVersion('1.4.1');
    });
    expect(await fs.readJson(mockDir.resolve('backstage.json'))).toEqual({
      version: '1.4.1',
    });
    expect(log).toEqual([
      'Upgraded from release 0.0.1 to 1.4.1, please review these template changes:',
      undefined,
      '  https://backstage.github.io/upgrade-helper/?from=0.0.1&to=1.4.1',
      undefined,
    ]);
  });

  it("should create backstage.json if doesn't exist", async () => {
    mockDir.clear(); // empty temp test folder
    const latest = '1.4.1';

    const { log } = await withLogCollector(async () => {
      await bumpBackstageJsonVersion(latest);
    });
    expect(await fs.readJson(mockDir.resolve('backstage.json'))).toEqual({
      version: latest,
    });
    expect(log).toEqual([
      'Your project is now at version 1.4.1, which has been written to backstage.json',
    ]);
  });
});

describe('createVersionFinder', () => {
  async function findVersion(tag: string, data: Partial<PackageInfo>) {
    const fetcher = () =>
      Promise.resolve({
        name: '@backstage/core',
        'dist-tags': {},
        versions: [],
        time: {},
        ...data,
      });

    const versionFinder = createVersionFinder({
      releaseLine: tag,
      packageInfoFetcher: fetcher,
    });
    let result;
    await withLogCollector(async () => {
      result = await versionFinder('@backstage/core');
    });
    return result;
  }

  it('should create version finder', async () => {
    await expect(
      findVersion('latest', {
        time: { '1.0.0': '2020-01-01T00:00:00.000Z' },
        'dist-tags': { latest: '1.0.0' },
      }),
    ).resolves.toBe('1.0.0');

    await expect(
      findVersion('main', {
        time: { '1.0.0': '2020-01-01T00:00:00.000Z' },
        'dist-tags': { latest: '1.0.0' },
      }),
    ).resolves.toBe('1.0.0');

    await expect(
      findVersion('next', {
        time: { '1.0.0': '2020-01-01T00:00:00.000Z' },
        'dist-tags': { latest: '1.0.0' },
      }),
    ).resolves.toBe('1.0.0');

    await expect(
      findVersion('next', {
        time: {
          '1.0.0': '2020-01-01T00:00:00.000Z',
          '0.9.0': '2010-01-01T00:00:00.000Z',
        },
        'dist-tags': { latest: '1.0.0', next: '0.9.0' },
      }),
    ).resolves.toBe('1.0.0');

    await expect(
      findVersion('next', {
        time: {
          '1.0.0': '2020-01-01T00:00:00.000Z',
          '0.9.0': '2020-02-01T00:00:00.000Z',
        },
        'dist-tags': { latest: '1.0.0', next: '0.9.0' },
      }),
    ).resolves.toBe('0.9.0');

    await expect(findVersion('next', {})).rejects.toThrow(
      "No target 'latest' version found for @backstage/core",
    );

    await expect(
      findVersion('next', {
        time: {
          '0.9.0': '2020-02-01T00:00:00.000Z',
        },
        'dist-tags': { latest: '1.0.0', next: '0.9.0' },
      }),
    ).rejects.toThrow(
      "No time available for version '1.0.0' of @backstage/core",
    );

    await expect(
      findVersion('next', {
        time: {
          '1.0.0': '2020-01-01T00:00:00.000Z',
        },
        'dist-tags': { latest: '1.0.0', next: '0.9.0' },
      }),
    ).rejects.toThrow(
      "No time available for version '0.9.0' of @backstage/core",
    );
  });
});
