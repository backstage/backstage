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

import { JSDOM } from 'jsdom';
import { afterEach } from 'node:test';

// Installs a jsdom window as the global environment, the way the Jest jsdom
// environment does, and unmounts rendered components after every test.
// Import this first in any test that renders React components.

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://backstage.io/',
  pretendToBeVisual: true,
});

// Keep what Node already provides (fetch, URL, timers, ...) and fill in the
// DOM classes and globals that Testing Library expects.
const keep = new Set(Object.getOwnPropertyNames(globalThis));
const override = new Set(['window', 'document', 'navigator']);
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (key.startsWith('_') || (keep.has(key) && !override.has(key))) {
    continue;
  }
  Object.defineProperty(globalThis, key, {
    configurable: true,
    get: () => Reflect.get(dom.window, key),
  });
}
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: dom.window,
});

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Testing Library reads `document` when it is first loaded, so it can only be
// required once the globals above are in place.
afterEach(() => {
  require('@testing-library/react').cleanup();
});
