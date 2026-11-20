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

import { createRequire } from 'node:module';
import { resolvePackagePath } from '@backstage/backend-plugin-api';

const requireFromHere = createRequire(import.meta.url);

/**
 * Loads one of `@backstage/ai-node`'s shared database migrations by name,
 * following the repo convention of shipping migrations outside the package
 * exports map.
 *
 * @alpha
 */
export function loadAiMigration(name: string): {
  up(db: unknown): Promise<void>;
} {
  return requireFromHere(
    resolvePackagePath('@backstage/ai-node', 'migrations', `${name}.js`),
  );
}
