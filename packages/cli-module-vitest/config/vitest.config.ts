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

import { defineConfig } from 'vitest/config';

// The actual configuration is loaded dynamically by the CLI command handler.
// This file serves as the static config entry point that vitest --config
// points to for single-package mode.
export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ['**/*.test.{ts,js,tsx,jsx,mts,cts,mjs,cjs}'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
