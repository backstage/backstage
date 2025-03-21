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
  constructor(config, ...restAgs) {
    super(config, ...restAgs);
    this.allowLoadAsEsm = config.extensionsToTreatAsEsm.includes('.mts');
  }

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

  // Unfortunately we need to use this unstable API to make sure that .js files
  // are only loaded as modules where ESM is supported, i.e. Node.js packages.
  unstable_shouldLoadAsEsm(path, ...restArgs) {
    if (!this.allowLoadAsEsm) {
      return false;
    }
    return super.unstable_shouldLoadAsEsm(path, ...restArgs);
  }
};
