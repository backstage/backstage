/*
 * Copyright 2021 The Backstage Authors
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
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

// eslint-disable-next-line no-restricted-imports
import { TextEncoder } from 'util';

// Mock browser crypto.subtle.digest method for sha-256 hashing.
Object.defineProperty(global.self, 'crypto', {
  value: {
    subtle: {
      digest: (_algo: string, data: Uint8Array): ArrayBuffer => data.buffer,
    },
  },
});

// Also used in browser-based APIs for hashing.
Object.defineProperty(global.self, 'TextEncoder', {
  value: TextEncoder,
});
