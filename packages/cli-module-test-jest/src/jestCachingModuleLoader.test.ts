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

let mockResolution:
  | { shouldLoadAsEsm?: (modulePath: string) => boolean }
  | undefined;

jest.mock('jest-runtime', () => ({
  default: class {
    _resolution = mockResolution;

    unstable_shouldLoadAsEsm() {
      return true;
    }
  },
}));

function createRuntime(extensionsToTreatAsEsm: string[] = []) {
  const Runtime = require('../config/jestCachingModuleLoader');
  return new Runtime({ extensionsToTreatAsEsm });
}

describe('jestCachingModuleLoader', () => {
  it('disables native ESM loading for CommonJS test projects', () => {
    mockResolution = { shouldLoadAsEsm: () => true };

    const runtime = createRuntime();

    expect(runtime._resolution.shouldLoadAsEsm('dependency.js')).toBe(false);
  });

  it('uses the unstable Jest runtime API when no resolution API is available', () => {
    mockResolution = undefined;

    const runtime = createRuntime();

    expect(runtime.unstable_shouldLoadAsEsm('dependency.js')).toBe(false);
  });

  it('reports an incompatible Jest runtime resolution API', () => {
    mockResolution = {};

    expect(() => createRuntime()).toThrow(
      'The installed Jest version does not expose the expected module resolution API',
    );
  });

  it('reports a Jest runtime resolution API that cannot be overridden', () => {
    mockResolution = Object.freeze({ shouldLoadAsEsm: () => true });

    expect(() => createRuntime()).toThrow(
      'The installed Jest version does not allow overriding its module resolution API',
    );
  });
});
