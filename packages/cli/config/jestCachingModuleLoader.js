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

const { default: JestRuntime } = require('jest-runtime');

const scriptTransformCache = new Map();

module.exports = class CachingJestRuntime extends JestRuntime {
  // This may or may not be a good idea. Theoretically I don't know why this would impact
  // test correctness and flakiness, but it seems like it may introduce flakiness and strange failures.
  // It does seem to speed up test execution by a fair amount though.
  createScriptFromCode(scriptSource, filename) {
    let script = scriptTransformCache.get(scriptSource);
    if (!script) {
      script = super.createScriptFromCode(scriptSource, filename);
      // Tried to store the script object in a WeakRef here. It starts out at
      // about 90% hit rate, but eventually drops all the way to 20%, and overall
      // it seemed to increase memory usage by 20% or so.
      scriptTransformCache.set(scriptSource, script);
    }
    return script;
  }

  // Notes(Rugvip): As far as I can tell this is the best we can currently do
  // for runtime ESM support in Jest. What the below logic effectively does is
  // to only allow packages to be loaded as ESM if all imports of that package
  // are done in an ESM compatible way, as in either from ESM code or with a
  // dynamic import.
  cjsModules = new Set();
  _resolveCjsModule(...args) {
    const path = super._resolveCjsModule(...args);
    this.cjsModules.add(path);
    return path;
  }
  unstable_shouldLoadAsEsm(path, ...restArgs) {
    if (this.cjsModules.has(path)) {
      return false;
    }
    return super.unstable_shouldLoadAsEsm(path, ...restArgs);
  }
};
