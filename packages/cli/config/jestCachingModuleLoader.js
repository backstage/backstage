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

module.exports = class CachingJestRuntime extends JestRuntime {
  constructor(config, ...restArgs) {
    super(config, ...restArgs);
    this.allowLoadAsEsm = config.extensionsToTreatAsEsm.includes('.mts');
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
