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
const glob = require('util').promisify(require('glob'));

async function getProjectConfig(targetPath) {
  const configJsPath = path.resolve(targetPath, 'jest.config.js');
  const configTsPath = path.resolve(targetPath, 'jest.config.ts');
  // If the package has it's own jest config, we use that instead.
  if (await fs.pathExists(configJsPath)) {
    return require(configJsPath);
  } else if (await fs.pathExists(configTsPath)) {
    return require(configTsPath);
  }

  // We read all "jest" config fields in package.json files all the way to the filesystem root.
  // All configs are merged together to create the final config, with longer paths taking precedence.
  // The merging of the configs is shallow, meaning e.g. all transforms are replaced if new ones are defined.
  const pkgJsonConfigs = [];
  let currentPath = targetPath;

  // Some sanity check to avoid infinite loop
  for (let i = 0; i < 100; i++) {
    const packagePath = path.resolve(currentPath, 'package.json');
    const exists = fs.pathExistsSync(packagePath);
    if (exists) {
      try {
        const data = fs.readJsonSync(packagePath);
        if (data.jest) {
          pkgJsonConfigs.unshift(data.jest);
        }
      } catch (error) {
        throw new Error(
          `Failed to parse package.json file reading jest configs, ${error}`,
        );
      }
    }

    const newPath = path.dirname(currentPath);
    if (newPath === currentPath) {
      break;
    }
    currentPath = newPath;
  }

  // We add an additional Jest config parameter only known by the Backstage CLI
  // called `transformModules`. It's a list of modules that we want to apply
  // our configured jest transformations for.
  // This is useful when packages are published in untranspiled ESM or TS form.
  const transformModules = pkgJsonConfigs
    .flatMap(conf => {
      const modules = conf.transformModules || [];
      delete conf.transformModules;
      return modules;
    })
    .map(name => `${name}/`)
    .join('|');
  const transformModulePattern = transformModules && `(?!${transformModules})`;

  const options = {
    rootDir: path.resolve(targetPath, 'src'),
    coverageDirectory: path.resolve(targetPath, 'coverage'),
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': require.resolve('jest-css-modules'),
    },

    transform: {
      '\\.esm\\.js$': require.resolve('./jestEsmTransform.js'), // See jestEsmTransform.js
      '\\.(js|jsx|ts|tsx)$': require.resolve('@sucrase/jest-plugin'),
      '\\.(bmp|gif|jpg|jpeg|png|frag|xml|svg|eot|woff|woff2|ttf)$':
        require.resolve('./jestFileTransform.js'),
      '\\.(yaml)$': require.resolve('jest-transform-yaml'),
    },

    // A bit more opinionated
    testMatch: ['**/?(*.)test.{js,jsx,mjs,ts,tsx}'],

    // Default behaviour is to not apply transforms for node_modules, but we still want
    // to apply the esm-transformer to .esm.js files, since that's what we use in backstage packages.
    transformIgnorePatterns: [
      `/node_modules/${transformModulePattern}.*\\.(?:(?<!esm\\.)js|json)$`,
    ],
  };

  // Use src/setupTests.ts as the default location for configuring test env
  if (fs.existsSync(path.resolve(targetPath, 'src/setupTests.ts'))) {
    options.setupFilesAfterEnv = ['<rootDir>/setupTests.ts'];
  }

  return Object.assign(options, ...pkgJsonConfigs);
}

// This loads the root jest config, which in turn will either refer to a single
// configuration for the current package, or a collection of configurations for
// the target workspace packages
async function getRootConfig() {
  const targetPath = process.cwd();
  const targetPackagePath = path.resolve(targetPath, 'package.json');
  const exists = await fs.pathExists(targetPackagePath);

  if (!exists) {
    return getProjectConfig(targetPath);
  }

  // Check whether the current package is a workspace root or not
  const data = await fs.readJson(targetPackagePath);
  const workspacePatterns = data.workspaces && data.workspaces.packages;
  if (!workspacePatterns) {
    return getProjectConfig(targetPath);
  }

  // If the target package is a workspace root, we find all packages in the
  // workspace and load those in as separate jest projects instead.
  const projectPaths = await Promise.all(
    workspacePatterns.map(pattern => glob(path.join(targetPath, pattern))),
  ).then(_ => _.flat());

  const configs = await Promise.all(
    projectPaths.flat().map(async projectPath => {
      const packagePath = path.resolve(projectPath, 'package.json');
      if (!(await fs.pathExists(packagePath))) {
        return undefined;
      }

      // We check for the presence of "backstage-cli test" in the package test
      // script to determine whether a given package should be tested
      const packageData = await fs.readJson(packagePath);
      const testScript = packageData.scripts && packageData.scripts.test;
      if (testScript && testScript.includes('backstage-cli test')) {
        return await getProjectConfig(projectPath);
      }

      return undefined;
    }),
  ).then(cs => cs.filter(Boolean));

  return {
    rootDir: targetPath,
    projects: configs,
  };
}

module.exports = getRootConfig();
