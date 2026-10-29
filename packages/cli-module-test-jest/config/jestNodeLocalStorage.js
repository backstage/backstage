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

// Node.js 25 and later define a global `localStorage` that only works with the
// `--localstorage-file` option. Without that option, using the global prints a
// warning, and libraries such as msw 2 use it in tests. The global is removed
// unless the option is set on the command line or in NODE_OPTIONS, since
// Node.js 24 and earlier don't define it.
function removeUnusableLocalStorage(target, proc) {
  // Browser environments such as jsdom provide their own localStorage
  if (typeof target.window !== 'undefined') {
    return;
  }
  const options = [...(proc.execArgv ?? []), proc.env?.NODE_OPTIONS ?? ''];
  if (options.some(option => /--localstorage[-_]file/.test(option))) {
    return;
  }
  delete target.localStorage;
}

removeUnusableLocalStorage(globalThis, process);

module.exports = { removeUnusableLocalStorage };
