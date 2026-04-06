/*
 * Copyright 2026 The Backstage Authors
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

const fs = require('fs-extra');
const path = require('node:path');
const { glob } = require('glob');
const paths = require('@backstage/cli-common').findPaths(process.cwd());

const SRC_EXTS = ['ts', 'js', 'tsx', 'jsx', 'mts', 'cts', 'mjs', 'cjs'];

const FRONTEND_ROLES = [
  'frontend',
  'web-library',
  'common-library',
  'frontend-plugin',
  'frontend-plugin-module',
];

const NODE_ROLES = [
  'backend',
  'cli',
  'cli-module',
  'node-library',
  'backend-plugin',
  'backend-plugin-module',
];

function getRoleEnvironment(role) {
  if (FRONTEND_ROLES.includes(role)) {
    return 'jsdom';
  }
  return 'node';
}

async function getProjectConfig(targetPath, extraConfig) {
  const configPath = path.resolve(targetPath, 'vitest.config.ts');
  if (await fs.pathExists(configPath)) {
    return { configPath };
  }

  const pkgJson = await fs.readJson(path.resolve(targetPath, 'package.json'));
  const role = pkgJson.backstage?.role;
  const environment = getRoleEnvironment(role);

  const setupFiles = [];

  if (
    extraConfig.rejectFrontendNetworkRequests &&
    FRONTEND_ROLES.includes(role)
  ) {
    setupFiles.push(require.resolve('./vitestRejectNetworkRequests.js'));
  }

  for (const ext of SRC_EXTS) {
    if (fs.existsSync(path.resolve(targetPath, `src/setupTests.${ext}`))) {
      setupFiles.push(path.resolve(targetPath, `src/setupTests.${ext}`));
      break;
    }
  }

  return {
    test: {
      name: pkgJson.name,
      root: path.resolve(targetPath, 'src'),
      globals: true,
      environment,
      include: [`**/*.test.{${SRC_EXTS.join(',')}}`],
      passWithNoTests: true,
      css: { modules: { classNameStrategy: 'non-scoped' } },
      setupFiles,
      deps: {
        // Inline modules that need transformation (equivalent to transformIgnorePatterns)
        optimizer: {
          ssr: {
            include: [
              '@material-ui/**',
              'ajv',
              'core-js',
              'highlight.js',
              'prismjs',
              'json-schema',
              'react-use/**',
            ],
          },
        },
      },
    },
  };
}

async function getWorkspaceConfig() {
  const rootPkgJson = await fs.readJson(
    paths.resolveTargetRoot('package.json'),
  );

  const { rejectFrontendNetworkRequests } = rootPkgJson.jest ?? {};
  const extraConfig = { rejectFrontendNetworkRequests };

  const ws = rootPkgJson.workspaces;
  const workspacePatterns = Array.isArray(ws) ? ws : ws?.packages;

  // Single-package mode
  if (!workspacePatterns || paths.targetRoot !== paths.targetDir) {
    return getProjectConfig(paths.targetDir, extraConfig);
  }

  // Workspace mode — discover all packages with test scripts
  const projectPaths = await Promise.all(
    workspacePatterns.map(pattern =>
      glob(path.join(paths.targetRoot, pattern), {
        windowsPathsNoEscape: true,
      }),
    ),
  ).then(_ => _.flat());

  const projects = [];

  for (const projectPath of projectPaths) {
    const packagePath = path.resolve(projectPath, 'package.json');
    if (!(await fs.pathExists(packagePath))) {
      continue;
    }

    const packageData = await fs.readJson(packagePath);
    const testScript = packageData.scripts && packageData.scripts.test;
    const isSupportedTestScript =
      testScript?.includes('backstage-cli test') ||
      testScript?.includes('backstage-cli package test');
    if (testScript && isSupportedTestScript) {
      const config = await getProjectConfig(projectPath, extraConfig);
      if (config.test) {
        projects.push(config);
      }
    }
  }

  return {
    test: {
      coverage: {
        reportsDirectory: paths.resolveTarget('coverage'),
        provider: 'v8',
        include: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
        exclude: ['**/*.d.ts'],
      },
      projects,
    },
  };
}

module.exports = getWorkspaceConfig;
