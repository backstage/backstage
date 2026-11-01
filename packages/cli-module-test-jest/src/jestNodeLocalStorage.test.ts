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

// The setup file also runs for the tests of this package. These are read before
// the module is loaded below, since loading it removes the global too.
const loadedAsSetupFile =
  require.resolve('../config/jestNodeLocalStorage') in require.cache;
const hadLocalStorage = 'localStorage' in globalThis;
const {
  removeUnusableLocalStorage,
} = require('../config/jestNodeLocalStorage');

function createGlobal(extra: object = {}) {
  const get = jest.fn();
  const target = { ...extra };
  Object.defineProperty(target, 'localStorage', {
    configurable: true,
    enumerable: false,
    get,
  });
  return { target, get };
}

describe('jestNodeLocalStorage', () => {
  it('removes localStorage without reading it unless a storage file is set', () => {
    expect(loadedAsSetupFile).toBe(true);
    // Only Node.js 25 and later define the global
    expect(hadLocalStorage).toBe(false);

    const removed = createGlobal();
    removeUnusableLocalStorage(removed.target, {
      execArgv: ['--enable-source-maps'],
      env: {},
    });
    expect('localStorage' in removed.target).toBe(false);
    expect(removed.get).not.toHaveBeenCalled();

    for (const proc of [
      { execArgv: ['--localstorage-file=/tmp/storage'], env: {} },
      { execArgv: ['--localstorage_file=/tmp/storage'], env: {} },
      {
        execArgv: [],
        env: { NODE_OPTIONS: '--localstorage-file /tmp/storage' },
      },
    ]) {
      const kept = createGlobal();
      removeUnusableLocalStorage(kept.target, proc);
      expect('localStorage' in kept.target).toBe(true);
      expect(kept.get).not.toHaveBeenCalled();
    }
  });

  it('keeps the localStorage of browser environments', () => {
    const browser = createGlobal({ window: {} });
    removeUnusableLocalStorage(browser.target, { execArgv: [], env: {} });
    expect('localStorage' in browser.target).toBe(true);
    expect(browser.get).not.toHaveBeenCalled();
  });
});
