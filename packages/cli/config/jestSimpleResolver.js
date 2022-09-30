/*
 * Copyright 2022 The Backstage Authors
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

const { sync } = require('resolve');
const { default: JestResolver } = require('jest-resolve');
const { default: JestRuntime } = require('jest-runtime');

// This implementation has some risky assumptions, such as:
// * This is never called with any options that impact runtime
// * This is never called with virtualMocks
// * There's no FS shenanigans (symlinks, etc) that could cause
//   the generated id to be inaccurate.
class SimpleJestResolver extends JestResolver {
  getModuleID(virtualMocks, from, moduleName, _options = undefined) {
    return `${from}:${moduleName}`;
  }
}

// Copied from Jest's "createResolver" code, so that we could still fill
// the Resolver constructor accurately.
const getModuleNameMapper = config => {
  if (
    Array.isArray(config.moduleNameMapper) &&
    config.moduleNameMapper.length
  ) {
    return config.moduleNameMapper.map(([regex, moduleName]) => ({
      moduleName,
      regex: new RegExp(regex),
    }));
  }
  return null;
};

// Hook into Jest (in a risky way!) so that our resolver is used for generating
// module IDs.
JestRuntime.createResolver = (config, moduleMap) => {
  return new SimpleJestResolver(moduleMap, {
    defaultPlatform: config.haste.defaultPlatform,
    extensions: config.moduleFileExtensions.map(extension => `.${extension}`),
    hasCoreModules: true,
    moduleDirectories: config.moduleDirectories,
    moduleNameMapper: getModuleNameMapper(config),
    modulePaths: config.modulePaths,
    platforms: config.haste.platforms,
    resolver: config.resolver,
    rootDir: config.rootDir,
  });
};

module.exports = function moduleResolver(p, options) {
  return sync(p, options);
};
