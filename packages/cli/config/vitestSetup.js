/*
 * Copyright 2025 The Backstage Authors
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

// This setup file provides Jest compatibility by exposing 'jest' as an alias for 'vi'
// This allows existing tests using jest.mock(), jest.fn(), etc. to work with Vitest

import { vi } from 'vitest';

// Create jest global as an enhanced version of vi with Jest-specific methods
globalThis.jest = {
  ...vi,
  // jest.setTimeout(ms) -> vi.setConfig({ testTimeout: ms })
  setTimeout: ms => {
    vi.setConfig({ testTimeout: ms });
  },
  // jest.requireActual is vi.importActual but synchronous - provide async version
  requireActual: moduleName => {
    // For synchronous requires, just use require
    return require(moduleName);
  },
};
