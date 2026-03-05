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

import {
  DatabaseService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { HumanDuration } from '@backstage/types';
import { DatabasePluginKeySource } from './DatabasePluginKeySource';
import { StaticConfigPluginKeySource } from './StaticConfigPluginKeySource';
import { PluginKeySource } from './types';

const CONFIG_ROOT_KEY = 'backend.auth.pluginKeyStore';

export async function createPluginKeySource(options: {
  config: RootConfigService;
  database: DatabaseService;
  logger: LoggerService;
  keyDuration: HumanDuration;
  algorithm?: string;
}): Promise<PluginKeySource> {
  const keyStoreConfig = options.config.getOptionalConfig(CONFIG_ROOT_KEY);
  const type = keyStoreConfig?.getOptionalString('type') ?? 'database';

  if (!keyStoreConfig || type === 'database') {
    return DatabasePluginKeySource.create({
      database: options.database,
      logger: options.logger,
      keyDuration: options.keyDuration,
      algorithm: options.algorithm,
    });
  } else if (type === 'static') {
    return StaticConfigPluginKeySource.create({
      sourceConfig: keyStoreConfig,
      keyDuration: options.keyDuration,
    });
  }

  throw new Error(
    `Unsupported config value ${CONFIG_ROOT_KEY}.type '${type}'; expected one of 'database', 'static'`,
  );
}
