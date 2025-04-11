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
import child_process from 'child_process';
import { resolve as resolvePath } from 'path';
import os from 'os';
import {
  Task,
  buildAppTask,
  checkAppExistsTask,
  checkPathExistsTask,
  moveAppTask,
  templatingTask,
  tryInitGitRepository,
  readGitConfig,
  fetchYarnLockSeedTask,
} from './tasks';
import {
  createMockDirectory,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';

jest.spyOn(Task, 'log').mockReturnValue(undefined);
jest.spyOn(Task, 'error').mockReturnValue(undefined);
jest.spyOn(Task, 'section').mockReturnValue(undefined);
jest
  .spyOn(Task, 'forItem')
  .mockImplementation((_a, _b, taskFunc) => taskFunc());

jest.mock('child_process');

// By mocking this the filesystem mocks won't mess with reading all of the package.jsons
jest.mock('./versions', () => ({
  packageVersions: {
    root: '1.2.3',
    '@backstage/cli': '1.0.0',
    '@backstage/backend-defaults': '1.0.0',
    '@backstage/backend-tasks': '1.0.0',
    '@backstage/canon': '1.0.0',
    '@backstage/catalog-model': '1.0.0',
    '@backstage/catalog-client': '1.0.0',
    '@backstage/config': '1.0.0',
    '@backstage/plugin-app-backend': '1.0.0',
    '@backstage/plugin-auth-backend': '1.0.0',
    '@backstage/plugin-auth-node': '1.0.0',
    '@backstage/plugin-auth-backend-module-github-provider': '1.0.0',
    '@backstage/plugin-auth-backend-module-guest-provider': '1.0.0',
    '@backstage/plugin-catalog-backend': '1.0.0',
    '@backstage/plugin-catalog-backend-module-logs': '1.0.0',
    '@backstage/plugin-catalog-backend-module-scaffolder-entity-model': '1.0.0',
    '@backstage/plugin-permission-common': '1.0.0',
    '@backstage/plugin-permission-node': '1.0.0',
    '@backstage/plugin-permission-backend': '1.0.0',
    '@backstage/plugin-permission-backend-module-allow-all-policy': '1.0.0',
    '@backstage/plugin-proxy-backend': '1.0.0',
    '@backstage/plugin-scaffolder-backend': '1.0.0',
    '@backstage/plugin-search-backend': '1.0.0',
    '@backstage/plugin-search-backend-module-catalog': '1.0.0',
    '@backstage/plugin-search-backend-module-pg': '1.0.0',
    '@backstage/plugin-search-backend-module-techdocs': '1.0.0',
    '@backstage/plugin-search-backend-node': '1.0.0',
    '@backstage/plugin-techdocs-backend': '1.0.0',
    '@backstage/app-defaults': '1.0.0',
    '@backstage/core-app-api': '1.0.0',
    '@backstage/core-components': '1.0.0',
    '@backstage/core-plugin-api': '1.0.0',
    '@backstage/e2e-test-utils': '1.0.0',
    '@backstage/integration-react': '1.0.0',
    '@backstage/plugin-api-docs': '1.0.0',
    '@backstage/plugin-catalog': '1.0.0',
    '@backstage/plugin-catalog-common': '1.0.0',
    '@backstage/plugin-catalog-graph': '1.0.0',
    '@backstage/plugin-catalog-import': '1.0.0',
    '@backstage/plugin-catalog-react': '1.0.0',
    '@backstage/plugin-kubernetes': '1.0.0',
    '@backstage/plugin-kubernetes-backend': '1.0.0',
    '@backstage/plugin-org': '1.0.0',
    '@backstage/plugin-scaffolder': '1.0.0',
    '@backstage/plugin-scaffolder-backend-module-github': '1.0.0',
    '@backstage/plugin-permission-react': '1.0.0',
    '@backstage/plugin-search': '1.0.0',
    '@backstage/plugin-search-react': '1.0.0',
    '@backstage/plugin-techdocs': '1.0.0',
    '@backstage/plugin-techdocs-react': '1.0.0',
    '@backstage/plugin-techdocs-module-addons-contrib': '1.0.0',
    '@backstage/plugin-user-settings': '1.0.0',
    '@backstage/theme': '1.0.0',
    '@backstage/test-utils': '1.0.0',
  },
}));

describe('tasks', () => {
  const mockExec = child_process.exec as unknown as jest.MockedFunction<
    (
      command: string,
      options: any,
      callback: (
        error: Error | null,
        result: { stdout: string; stderr: string },
      ) => void,
    ) => void
  >;

  const mockDir = createMockDirectory();

  const origCwd = process.cwd();
  const realChdir = process.chdir;
  // If anyone calls chdir then make it resolve within the tmpdir
  const mockChdir = jest.spyOn(process, 'chdir');

  beforeEach(() => {
    mockDir.setContent({
      projects: {
        'my-module.ts': '',
        'dir/my-file.txt': '',
      },
      'tmp/mockApp': {
        '.gitignore': '',
        'package.json': '',
        'packages/app/package.json': '',
      },
    });
    realChdir(mockDir.path);
    mockChdir.mockImplementation((dir: string) =>
      realChdir(mockDir.resolve(dir)),
    );
  });

  afterEach(() => {
    mockExec.mockRestore();
    mockChdir.mockReset();
  });

  afterAll(() => {
    realChdir(origCwd);
  });

  describe('checkAppExistsTask', () => {
    it('should do nothing if the directory does not exist', async () => {
      const dir = 'projects/';
      const name = 'MyNewApp';
      await expect(checkAppExistsTask(dir, name)).resolves.not.toThrow();
    });

    it('should throw an error when a file of the same name exists', async () => {
      const dir = 'projects/';
      const name = 'my-module.ts';
      await expect(checkAppExistsTask(dir, name)).rejects.toThrow(
        'already exists',
      );
    });

    it('should throw an error when a directory of the same name exists', async () => {
      const dir = 'projects/';
      const name = 'dir';
      await expect(checkAppExistsTask(dir, name)).rejects.toThrow(
        'already exists',
      );
    });
  });

  describe('checkPathExistsTask', () => {
    it('should create a directory at the given path', async () => {
      const appDir = 'projects/newProject';
      await expect(checkPathExistsTask(appDir)).resolves.not.toThrow();
      expect(fs.existsSync(appDir)).toBe(true);
    });

    it('should do nothing if a directory of the same name exists', async () => {
      const appDir = 'projects/dir';
      await expect(checkPathExistsTask(appDir)).resolves.not.toThrow();
      expect(fs.existsSync(appDir)).toBe(true);
    });

    it('should fail if a file of the same name exists', async () => {
      await expect(
        checkPathExistsTask('projects/my-module.ts'),
      ).rejects.toThrow('already exists');
    });
  });

  describe('buildAppTask', () => {
    it('should change to `appDir` and run `yarn install` and `yarn tsc`', async () => {
      // requires callback implementation to support `promisify` wrapper
      // https://stackoverflow.com/a/60579617/10044859
      mockExec.mockImplementation((_command, callback) => {
        if (_command === 'yarn --version') {
          callback(null, { stdout: '1.22.5', stderr: 'standard error' });
        } else {
          callback(null, { stdout: 'standard out', stderr: 'standard error' });
        }
      });

      const appDir = 'projects/dir';
      await expect(buildAppTask(appDir)).resolves.not.toThrow();
      expect(mockChdir).toHaveBeenCalledTimes(1);
      expect(mockChdir).toHaveBeenNthCalledWith(1, appDir);
      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenNthCalledWith(
        1,
        'yarn install',
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        2,
        'yarn tsc',
        expect.any(Function),
      );
    });

    it('should fail if project directory does not exist', async () => {
      const appDir = 'projects/missingProject';
      await expect(buildAppTask(appDir)).rejects.toThrow(
        'no such file or directory',
      );
    });
  });

  describe('moveAppTask', () => {
    const tempDir = 'tmp/mockApp/';
    const id = 'myApp';

    it('should move all files in the temp dir to the target dir', async () => {
      const destination = 'projects/mockApp';
      await moveAppTask(tempDir, destination, id);
      expect(fs.existsSync('projects/mockApp/.gitignore')).toBe(true);
      expect(fs.existsSync('projects/mockApp/package.json')).toBe(true);
      expect(fs.existsSync('projects/mockApp/packages/app/package.json')).toBe(
        true,
      );
    });

    it('should fail to move files if destination already exists', async () => {
      const destination = 'projects';
      await expect(moveAppTask(tempDir, destination, id)).rejects.toThrow(
        'dest already exists',
      );
    });

    it('should remove temporary files if move succeeded', async () => {
      const destination = 'projects/mockApp';
      await moveAppTask(tempDir, destination, id);
      expect(fs.existsSync('tmp/mockApp')).toBe(false);
    });

    it('should remove temporary files if move failed', async () => {
      const destination = 'projects';
      await expect(moveAppTask(tempDir, destination, id)).rejects.toThrow();
      expect(fs.existsSync('tmp/mockApp')).toBe(false);
    });
  });

  describe('templatingTask', () => {
    it('should generate a project populating context parameters', async () => {
      const templateDir = resolvePath(__dirname, '../../templates/default-app');
      const destinationDir = 'templatedApp';
      const context = {
        name: 'SuperCoolBackstageInstance',
        dbTypeSqlite: true,
      };
      await templatingTask(templateDir, destinationDir, context);
      expect(fs.existsSync('templatedApp/package.json')).toBe(true);
      expect(fs.existsSync('templatedApp/.dockerignore')).toBe(true);
      await expect(fs.readJson('templatedApp/backstage.json')).resolves.toEqual(
        {
          version: '1.2.3',
        },
      );
      // catalog was populated with `context.name`
      await expect(
        fs.readFile('templatedApp/catalog-info.yaml', 'utf-8'),
      ).resolves.toContain('name: SuperCoolBackstageInstance');
      // backend dependencies include `sqlite3` from `context.SQLite`
      await expect(
        fs.readFile('templatedApp/packages/backend/package.json', 'utf-8'),
      ).resolves.toContain('sqlite3"');
    });
  });

  describe('readGitConfig', () => {
    const tmpDirPrefix = resolvePath(os.tmpdir(), 'git-temp-dir-');

    it('should return git config if git package is installed and git credentials are set', async () => {
      mockExec.mockImplementation((_command, _options, callback) => {
        callback(null, { stdout: 'main', stderr: '' });
      });

      const gitConfig = await readGitConfig();

      expect(gitConfig).toEqual({
        defaultBranch: 'main',
      });
      expect(mockExec).toHaveBeenCalledTimes(3);
      expect(mockExec).toHaveBeenCalledWith(
        'git init',
        { cwd: expect.stringContaining(tmpDirPrefix) },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenCalledWith(
        'git commit --allow-empty -m "Initial commit"',
        { cwd: expect.stringContaining(tmpDirPrefix) },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenCalledWith(
        'git branch --format="%(refname:short)"',
        { cwd: expect.stringContaining(tmpDirPrefix) },
        expect.any(Function),
      );
    });

    it('should return false if git config is invalid', async () => {
      mockExec.mockImplementation((_command, _options, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      const gitConfig = await readGitConfig();

      expect(gitConfig).toEqual({
        defaultBranch: undefined,
      });
      expect(mockExec).toHaveBeenCalledTimes(3);
    });
  });

  describe('tryInitGitRepository', () => {
    it('should initialize a git repository at the given path', async () => {
      const destinationDir = 'tmp/mockApp';

      mockExec.mockImplementation((command, _opts, callback) => {
        if (command.startsWith('git rev-parse')) {
          callback(new Error('not a git repo'), { stdout: '', stderr: '' });
        } else {
          callback(null, { stdout: '', stderr: '' });
        }
      });

      await expect(tryInitGitRepository(destinationDir)).resolves.toBe(true);

      expect(mockExec).toHaveBeenCalledTimes(4);
      expect(mockExec).toHaveBeenNthCalledWith(
        1,
        'git rev-parse --is-inside-work-tree',
        { cwd: destinationDir },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        2,
        'git init',
        { cwd: destinationDir },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        3,
        'git add .',
        { cwd: destinationDir },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        4,
        'git commit -m "Initial commit"',
        { cwd: destinationDir },
        expect.any(Function),
      );
    });

    it('should not initialize a git repository if in one already', async () => {
      const destinationDir = 'tmp/mockApp';

      mockExec.mockImplementation((_command, _opts, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      await expect(tryInitGitRepository(destinationDir)).resolves.toBe(false);

      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenNthCalledWith(
        1,
        'git rev-parse --is-inside-work-tree',
        { cwd: destinationDir },
        expect.any(Function),
      );
    });
  });

  describe('fetchYarnLockSeedTask', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

    it('should fetch the yarn.lock seed file', async () => {
      worker.use(
        http.get(
          'https://raw.githubusercontent.com/backstage/backstage/master/packages/create-app/seed-yarn.lock',
          () =>
            HttpResponse.text(`# the-lockfile-header

// some comments
// in the file
// that should
// be removed

// a comment about the entry
"@backstage/cli@1.0.0":
  some info
`),
        ),
      );

      mockDir.clear();

      await expect(fetchYarnLockSeedTask(mockDir.path)).resolves.toBe(true);

      expect(mockDir.content({ shouldReadAsText: true })).toEqual({
        'yarn.lock': `# the-lockfile-header


"@backstage/cli@1.0.0":
  some info
`,
      });
    });

    it('should fail gracefully', async () => {
      worker.use(
        http.get(
          'https://raw.githubusercontent.com/backstage/backstage/master/packages/create-app/seed-yarn.lock',
          () => new HttpResponse(null, { status: 404 }),
        ),
      );

      mockDir.clear();

      await expect(fetchYarnLockSeedTask(mockDir.path)).resolves.toBe(false);

      expect(mockDir.content()).toEqual({});
    });

    it('should time out if it takes too long to fetch', async () => {
      worker.use(
        http.get(
          'https://raw.githubusercontent.com/backstage/backstage/master/packages/create-app/seed-yarn.lock',
          () => delay(5000),
        ),
      );

      mockDir.clear();

      await expect(fetchYarnLockSeedTask(mockDir.path)).resolves.toBe(false);

      expect(mockDir.content()).toEqual({});
    });
  });
});
