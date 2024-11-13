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

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const glob = require('util').promisify(require('glob'));
const { version } = require('../package.json');
const paths = require('@backstage/cli-common').findPaths(process.cwd());

const SRC_EXTS = ['ts', 'js', 'tsx', 'jsx', 'mts', 'cts', 'mjs', 'cjs'];

const FRONTEND_ROLES = [
  'frontend',
  'web-library',
  'common-library',
  'frontend-plugin',
  'frontend-plugin-module',
];

const envOptions = {
  oldTests: Boolean(process.env.BACKSTAGE_OLD_TESTS),
};

try {
  require.resolve('react-dom/client', {
    paths: [paths.targetRoot],
  });
  process.env.HAS_REACT_DOM_CLIENT = true;
} catch {
  /* ignored */
}

/**
 * A list of config keys that are valid for project-level config.
 * Jest will complain if we forward any other root configuration to the projects.
 *
 * @type {Array<keyof import('@jest/types').Config.ProjectConfig>}
 */
const projectConfigKeys = [
  'automock',
  'cache',
  'cacheDirectory',
  'clearMocks',
  'collectCoverageFrom',
  'coverageDirectory',
  'coveragePathIgnorePatterns',
  'cwd',
  'dependencyExtractor',
  'detectLeaks',
  'detectOpenHandles',
  'displayName',
  'errorOnDeprecated',
  'extensionsToTreatAsEsm',
  'fakeTimers',
  'filter',
  'forceCoverageMatch',
  'globalSetup',
  'globalTeardown',
  'globals',
  'haste',
  'id',
  'injectGlobals',
  'moduleDirectories',
  'moduleFileExtensions',
  'moduleNameMapper',
  'modulePathIgnorePatterns',
  'modulePaths',
  'openHandlesTimeout',
  'preset',
  'prettierPath',
  'resetMocks',
  'resetModules',
  'resolver',
  'restoreMocks',
  'rootDir',
  'roots',
  'runner',
  'runtime',
  'sandboxInjectedGlobals',
  'setupFiles',
  'setupFilesAfterEnv',
  'skipFilter',
  'skipNodeResolution',
  'slowTestThreshold',
  'snapshotResolver',
  'snapshotSerializers',
  'snapshotFormat',
  'testEnvironment',
  'testEnvironmentOptions',
  'testMatch',
  'testLocationInResults',
  'testPathIgnorePatterns',
  'testRegex',
  'testRunner',
  'transform',
  'transformIgnorePatterns',
  'watchPathIgnorePatterns',
  'unmockedModulePathPatterns',
  'workerIdleMemoryLimit',
];

const transformIgnorePattern = [
  '@material-ui',
  'ajv',
  'core-js',
  'jest-.*',
  'jsdom',
  'knex',
  'react',
  'react-dom',
  'highlight\\.js',
  'prismjs',
  'json-schema',
  'react-use/lib',
  'typescript',
].join('|');

// Provides additional config that's based on the role of the target package
function getRoleConfig(role) {
  if (FRONTEND_ROLES.includes(role)) {
    return { testEnvironment: require.resolve('jest-environment-jsdom') };
  }
  return { testEnvironment: require.resolve('jest-environment-node') };
}

async function getProjectConfig(targetPath, extraConfig, extraOptions) {
  const configJsPath = path.resolve(targetPath, 'jest.config.js');
  const configTsPath = path.resolve(targetPath, 'jest.config.ts');
  // If the package has it's own jest config, we use that instead.
  if (await fs.pathExists(configJsPath)) {
    return require(configJsPath);
  } else if (await fs.pathExists(configTsPath)) {
    return require(configTsPath);
  }

  // Jest config can be defined both in the root package.json and within each package. The root config
  // gets forwarded to us through the `extraConfig` parameter, while the package config is read here.
  // If they happen to be the same the keys will simply override each other.
  // The merging of the configs is shallow, meaning e.g. all transforms are replaced if new ones are defined.
  const pkgJson = await fs.readJson(path.resolve(targetPath, 'package.json'));

  const options = {
    ...extraConfig,
    rootDir: path.resolve(targetPath, 'src'),
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': require.resolve('jest-css-modules'),
    },

    transform: {
      '\\.(mjs|cjs|js)$': [
        require.resolve('./jestSwcTransform'),
        {
          jsc: {
            parser: {
              syntax: 'ecmascript',
            },
          },
        },
      ],
      '\\.jsx$': [
        require.resolve('./jestSwcTransform'),
        {
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      ],
      '\\.ts$': [
        require.resolve('./jestSwcTransform'),
        {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
      ],
      '\\.tsx$': [
        require.resolve('./jestSwcTransform'),
        {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      ],
      '\\.(bmp|gif|jpg|jpeg|png|ico|webp|frag|xml|svg|eot|woff|woff2|ttf)$':
        require.resolve('./jestFileTransform.js'),
      '\\.(yaml)$': require.resolve('./jestYamlTransform'),
    },

    // A bit more opinionated
    testMatch: [`**/*.test.{${SRC_EXTS.join(',')}}`],

    runtime: envOptions.oldTests
      ? undefined
      : require.resolve('./jestCachingModuleLoader'),

    transformIgnorePatterns: [`/node_modules/(?:${transformIgnorePattern})/`],
    ...getRoleConfig(pkgJson.backstage?.role),
  };

  options.setupFilesAfterEnv = options.setupFilesAfterEnv || [];

  if (
    extraOptions.rejectFrontendNetworkRequests &&
    FRONTEND_ROLES.includes(pkgJson.backstage?.role)
  ) {
    // By adding this first we ensure that it's possible to for example override
    // fetch with a mock in a custom setup file
    options.setupFilesAfterEnv.unshift(
      require.resolve('./jestRejectNetworkRequests.js'),
    );
  }

  if (options.testEnvironment === require.resolve('jest-environment-jsdom')) {
    // FIXME https://github.com/jsdom/jsdom/issues/1724
    options.setupFilesAfterEnv.unshift(require.resolve('cross-fetch/polyfill'));
  }

  // Use src/setupTests.* as the default location for configuring test env
  for (const ext of SRC_EXTS) {
    if (fs.existsSync(path.resolve(targetPath, `src/setupTests.${ext}`))) {
      options.setupFilesAfterEnv.push(`<rootDir>/setupTests.${ext}`);
      break;
    }
  }

  const config = Object.assign(options, pkgJson.jest);

  // The config id is a cache key that lets us share the jest cache across projects.
  // If no explicit id was configured, generated one based on the configuration.
  if (!config.id) {
    const configHash = crypto
      .createHash('sha256')
      .update(version)
      .update(Buffer.alloc(1))
      .update(JSON.stringify(config.transform).replaceAll(paths.targetRoot, ''))
      .digest('hex');
    config.id = `backstage_cli_${configHash}`;
  }

  return config;
}

// This loads the root jest config, which in turn will either refer to a single
// configuration for the current package, or a collection of configurations for
// the target workspace packages
async function getRootConfig() {
  const rootPkgJson = await fs.readJson(
    paths.resolveTargetRoot('package.json'),
  );

  const baseCoverageConfig = {
    coverageDirectory: paths.resolveTarget('coverage'),
    coverageProvider: envOptions.oldTests ? 'v8' : 'babel',
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx,mjs,cjs}', '!**/*.d.ts'],
  };

  const { rejectFrontendNetworkRequests, ...rootOptions } =
    rootPkgJson.jest ?? {};
  const extraRootOptions = {
    rejectFrontendNetworkRequests,
  };

  const workspacePatterns =
    rootPkgJson.workspaces && rootPkgJson.workspaces.packages;

  // Check if we're running within a specific monorepo package. In that case just get the single project config.
  if (!workspacePatterns || paths.targetRoot !== paths.targetDir) {
    return getProjectConfig(
      paths.targetDir,
      {
        ...baseCoverageConfig,
        ...rootOptions,
      },
      extraRootOptions,
    );
  }

  const globalRootConfig = { ...baseCoverageConfig };
  const globalProjectConfig = {};

  for (const [key, value] of Object.entries(rootOptions)) {
    if (projectConfigKeys.includes(key)) {
      globalProjectConfig[key] = value;
    } else {
      globalRootConfig[key] = value;
    }
  }

  // If the target package is a workspace root, we find all packages in the
  // workspace and load those in as separate jest projects instead.
  const projectPaths = await Promise.all(
    workspacePatterns.map(pattern =>
      glob(path.join(paths.targetRoot, pattern)),
    ),
  ).then(_ => _.flat());

  let projects = await Promise.all(
    projectPaths.flat().map(async projectPath => {
      const packagePath = path.resolve(projectPath, 'package.json');
      if (!(await fs.pathExists(packagePath))) {
        return undefined;
      }

      // We check for the presence of "backstage-cli test" in the package test
      // script to determine whether a given package should be tested
      const packageData = await fs.readJson(packagePath);
      const testScript = packageData.scripts && packageData.scripts.test;
      const isSupportedTestScript =
        testScript?.includes('backstage-cli test') ||
        testScript?.includes('backstage-cli package test');
      if (testScript && isSupportedTestScript) {
        return await getProjectConfig(
          projectPath,
          {
            ...globalProjectConfig,
            displayName: packageData.name,
          },
          extraRootOptions,
        );
      }

      return undefined;
    }),
  ).then(cs => cs.filter(Boolean));

  const cache = global.__backstageCli_jestSuccessCache;
  if (cache) {
    projects = await cache.filterConfigs(projects, globalRootConfig);
  }
  const watchProjectFilter = global.__backstageCli_watchProjectFilter;
  if (watchProjectFilter) {
    projects = await watchProjectFilter.filter(projects);
  }

  return {
    rootDir: paths.targetRoot,
    projects,
    testResultsProcessor: cache
      ? require.resolve('./jestCacheResultProcessor.cjs')
      : undefined,
    ...globalRootConfig,
  };
}

module.exports = getRootConfig();
