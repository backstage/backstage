/*
 * Copyright 2024 The Backstage Authors
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

import { resolve as resolvePath } from 'node:path';
import fs from 'fs-extra';
import { FixablePackage } from './fix';

/**
 * Ensures that packages with a config.d.ts file have the correct
 * configSchema and files entries in their package.json.
 *
 * - If config.d.ts exists, configSchema must reference it.
 * - If config.d.ts exists, it must be listed in the files array.
 * - If configSchema references a file, that file must be in the files array.
 */
export function fixConfigSchema(pkg: FixablePackage) {
  const hasConfigDts = fs.pathExistsSync(
    resolvePath(pkg.dir, 'config.d.ts'),
  );

  const configSchemaVal = pkg.packageJson.configSchema;

  // If configSchema is an inline object (not a string path), skip validation
  if (configSchemaVal !== undefined && typeof configSchemaVal === 'object') {
    return;
  }

  const configSchemaPath =
    typeof configSchemaVal === 'string' && configSchemaVal.trim().length > 0
      ? configSchemaVal
      : undefined;

  if (!hasConfigDts) {
    return;
  }

  // Ensure files array exists
  if (!Array.isArray(pkg.packageJson.files)) {
    pkg.packageJson.files = [];
  }

  const filesArray = pkg.packageJson.files as string[];

  // Fix configSchema to point to config.d.ts
  if (configSchemaPath !== 'config.d.ts') {
    (pkg.packageJson as any).configSchema = 'config.d.ts';
    pkg.changed = true;
  }

  // Add config.d.ts to the files array if missing
  if (!filesArray.includes('config.d.ts')) {
    filesArray.push('config.d.ts');
    pkg.changed = true;
  }
}
