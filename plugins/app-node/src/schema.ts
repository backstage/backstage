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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { ConfigSchema, loadConfigSchema } from '@backstage/config-loader';

/**
 * Loads the config schema that is embedded in the frontend build.
 *
 * @public
 */
export async function loadCompiledConfigSchema(
  appDistDir: string,
): Promise<ConfigSchema | undefined> {
  const schemaPath = resolvePath(appDistDir, '.config-schema.json');
  if (await fs.pathExists(schemaPath)) {
    const serializedSchema = await fs.readJson(schemaPath);

    return await loadConfigSchema({
      serialized: serializedSchema,
    });
  }

  return undefined;
}
