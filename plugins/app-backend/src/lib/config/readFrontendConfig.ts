/*
 * Copyright 2020 The Backstage Authors
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
import { AppConfig, Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import {
  ConfigSchema,
  loadConfigSchema,
  readEnvConfig,
} from '@backstage/config-loader';

/**
 * Read config from environment and process the backend config using the
 * schema that is embedded in the frontend build.
 */
export async function readFrontendConfig(options: {
  env: { [name: string]: string | undefined };
  appDistDir: string;
  config: Config;
  schema?: ConfigSchema;
}): Promise<AppConfig[]> {
  const { env, appDistDir, config } = options;

  const schemaPath = resolvePath(appDistDir, '.config-schema.json');
  if (await fs.pathExists(schemaPath)) {
    const envConfigs = readEnvConfig(env);
    const serializedSchema = await fs.readJson(schemaPath);

    try {
      const schema =
        options.schema ||
        (await loadConfigSchema({
          serialized: serializedSchema,
        }));

      return await schema.process(
        [...envConfigs, { data: config.get() as JsonObject, context: 'app' }],
        { visibility: ['frontend'], withDeprecatedKeys: true },
      );
    } catch (error) {
      throw new Error(
        'Invalid app bundle schema. If this error is unexpected you need to run `yarn build` in the app. ' +
          `If that doesn't help you should make sure your config schema is correct and rebuild the app bundle again. ` +
          `Caused by the following schema error, ${error}`,
      );
    }
  }

  return [];
}
