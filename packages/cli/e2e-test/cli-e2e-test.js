/*
 * Copyright 2020 Spotify AB
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

const os = require('os');
const fs = require('fs-extra');
const { resolve: resolvePath, join: joinPath } = require('path');
const Browser = require('zombie');
const {
  spawnPiped,
  runPlain,
  handleError,
  waitForPageWithText,
  waitFor,
  waitForExit,
  print,
} = require('./helpers');

async function main() {
  const rootDir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'backstage-e2e-'));
  print(`CLI E2E test root: ${rootDir}\n`);

  print('Building dist workspace');
  const workspaceDir = await buildDistWorkspace('workspace', rootDir);

  print('Creating a Backstage App');
  const appDir = await createApp('test-app', workspaceDir, rootDir);

  print('Creating a Backstage Plugin');
  const pluginName = await createPlugin('test-plugin', appDir);

  print('Starting the app');
  await testAppServe(pluginName, appDir);

  print('All tests successful, removing test dir');
  await fs.remove(rootDir);
}

/**
 * Builds a dist workspace that contains the cli and core packages
 */
async function buildDistWorkspace(workspaceName, rootDir) {
  const workspaceDir = resolvePath(rootDir, workspaceName);
  await fs.ensureDir(workspaceDir);

  print(`Preparing workspace`);
  await runPlain([
    'yarn',
    'backstage-cli',
    'build-workspace',
    workspaceDir,
    '@backstage/cli',
    '@backstage/core',
    '@backstage/dev-utils',
    '@backstage/test-utils',
  ]);

  print('Pinning yarn version in workspace');
  await pinYarnVersion(workspaceDir);

  print('Installing workspace dependencies');
  await runPlain(['yarn', 'install', '--production', '--frozen-lockfile'], {
    cwd: workspaceDir,
  });

  return workspaceDir;
}

/**
 * Pin the yarn version in a directory to the one we're using in the Backstage repo
 */
async function pinYarnVersion(dir) {
  const repoRoot = resolvePath(__dirname, '../../..');

  const yarnRc = await fs.readFile(resolvePath(repoRoot, '.yarnrc'), 'utf8');
  const yarnRcLines = yarnRc.split('\n');
  const yarnPathLine = yarnRcLines.find(line => line.startsWith('yarn-path'));
  const [, localYarnPath] = yarnPathLine.match(/"(.*)"/);
  const yarnPath = resolvePath(repoRoot, localYarnPath);

  await fs.writeFile(resolvePath(dir, '.yarnrc'), `yarn-path "${yarnPath}"\n`);
}

/**
 * Creates a new app inside rootDir called test-app, using packages from the workspaceDir
 */
async function createApp(appName, workspaceDir, rootDir) {
  const child = spawnPiped(
    [
      resolvePath(workspaceDir, 'packages/cli/bin/backstage-cli'),
      'create-app',
      '--skip-install',
    ],
    {
      cwd: rootDir,
    },
  );

  try {
    let stdout = '';
    child.stdout.on('data', data => {
      stdout = stdout + data.toString('utf8');
    });

    await waitFor(() => stdout.includes('Enter a name for the app'));
    child.stdin.write(`${appName}\n`);

    print('Waiting for app create script to be done');
    await waitForExit(child);

    const appDir = resolvePath(rootDir, appName);

    print('Rewriting module resolutions of app to use workspace packages');
    await overrideModuleResolutions(appDir, workspaceDir);

    print('Pinning yarn version and registry in app');
    await pinYarnVersion(appDir);
    await fs.writeFile(
      resolvePath(appDir, '.npmrc'),
      'registry=https://registry.npmjs.org/\n',
    );

    print('Test app created');

    for (const cmd of ['install', 'tsc', 'build', 'lint:all', 'test:all']) {
      print(`Running 'yarn ${cmd}' in newly created app`);
      await runPlain(['yarn', cmd], { cwd: appDir });
    }

    print(`Running 'yarn test:e2e:ci' in newly created app`);
    await runPlain(['yarn', 'test:e2e:ci'], {
      cwd: resolvePath(appDir, 'packages', 'app'),
      env: {
        ...process.env,
        APP_CONFIG_app_baseUrl: '"http://localhost:3001"',
      },
    });

    return appDir;
  } finally {
    child.kill();
  }
}

/**
 * This points dependency resolutions into the workspace for each package that is present there
 */
async function overrideModuleResolutions(appDir, workspaceDir) {
  const pkgJsonPath = resolvePath(appDir, 'package.json');
  const pkgJson = await fs.readJson(pkgJsonPath);

  pkgJson.resolutions = pkgJson.resolutions || {};
  pkgJson.dependencies = pkgJson.dependencies || {};

  const packageNames = await fs.readdir(resolvePath(workspaceDir, 'packages'));
  for (const name of packageNames) {
    const pkgPath = joinPath('..', 'workspace', 'packages', name);

    pkgJson.dependencies[`@backstage/${name}`] = `file:${pkgPath}`;
    pkgJson.resolutions[`@backstage/${name}`] = `file:${pkgPath}`;
    delete pkgJson.devDependencies[`@backstage/${name}`];
  }
  fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
}

/**
 * Uses create-plugin command to create a new plugin in the app
 */
async function createPlugin(pluginName, appDir) {
  const child = spawnPiped(['yarn', 'create-plugin'], {
    cwd: appDir,
  });

  try {
    let stdout = '';
    child.stdout.on('data', data => {
      stdout = stdout + data.toString('utf8');
    });

    await waitFor(() => stdout.includes('Enter an ID for the plugin'));
    child.stdin.write(`${pluginName}\n`);

    // await waitFor(() => stdout.includes('Enter the owner(s) of the plugin'));
    // child.stdin.write('@someuser\n');

    print('Waiting for plugin create script to be done');
    await waitForExit(child);

    const pluginDir = resolvePath(appDir, 'plugins', pluginName);
    for (const cmd of [['lint'], ['test', '--no-watch']]) {
      print(`Running 'yarn ${cmd.join(' ')}' in newly created plugin`);
      await runPlain(['yarn', ...cmd], { cwd: pluginDir });
    }

    return pluginName;
  } finally {
    child.kill();
  }
}

/**
 * Start serving the newly created app and make sure that the create plugin is rendering correctly
 */
async function testAppServe(pluginName, appDir) {
  const startApp = spawnPiped(['yarn', 'start'], {
    cwd: appDir,
    detached: true,
  });
  Browser.localhost('localhost', 3000);

  try {
    const browser = new Browser();

    await waitForPageWithText(browser, '/', 'Welcome to Backstage');
    await waitForPageWithText(
      browser,
      `/${pluginName}`,
      `Welcome to ${pluginName}!`,
    );

    print('Both App and Plugin loaded correctly');
  } catch (error) {
    throw new Error(`App serve test failed, ${error}`);
  } finally {
    // Kill entire process group, otherwise we'll end up with hanging serve processes
    process.kill(-startApp.pid, 'SIGTERM');
  }

  await waitForExit(startApp);
}

process.on('unhandledRejection', handleError);
main(process.argv.slice(2)).catch(handleError);
