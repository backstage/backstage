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

// 'jest-runtime' is included with jest and should be kept in sync with the installed jest version
// eslint-disable-next-line @backstage/no-undeclared-imports
const { default: JestRuntime } = require('jest-runtime');

module.exports = class CachingJestRuntime extends JestRuntime {
  constructor(config, ...restArgs) {
    super(config, ...restArgs);
    this.allowLoadAsEsm = config.extensionsToTreatAsEsm.includes('.mts');

    if (!this.allowLoadAsEsm) {
      // Jest 30.5 performs this check inside its CommonJS loader instead of
      // calling unstable_shouldLoadAsEsm below. Keep frontend tests on their
      // configured CommonJS transforms rather than loading dependency ESM
      // through Node.js require(esm), which does not support cyclic graphs.
      // Older supported Jest versions do not expose _resolution and continue
      // to call unstable_shouldLoadAsEsm below instead.
      const resolution = this._resolution;
      if (resolution !== undefined) {
        if (typeof resolution.shouldLoadAsEsm !== 'function') {
          throw new Error(
            'The installed Jest version does not expose the expected module resolution API',
          );
        }

        const shouldLoadAsEsm = () => false;
        if (
          !Reflect.set(resolution, 'shouldLoadAsEsm', shouldLoadAsEsm) ||
          resolution.shouldLoadAsEsm !== shouldLoadAsEsm
        ) {
          throw new Error(
            'The installed Jest version does not allow overriding its module resolution API',
          );
        }
      }
    }
  }

  // Unfortunately we need to use this unstable API to make sure that .js files
  // are only loaded as modules where ESM is supported, i.e. Node.js packages.
  unstable_shouldLoadAsEsm(path, ...restArgs) {
    if (!this.allowLoadAsEsm) {
      return false;
    }
    return super.unstable_shouldLoadAsEsm(path, ...restArgs);
  }
};
