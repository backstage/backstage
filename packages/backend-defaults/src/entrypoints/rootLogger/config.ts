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
import { RootConfigService } from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import {
  RootLoggerConfig,
  winstonLevels,
  WinstonLoggerLevelOverrideMatchers,
} from './types';

export const getRootLoggerConfig = (
  config: RootConfigService,
): RootLoggerConfig => {
  const level = config.getOptionalString('backend.logger.level');
  const meta = config
    .getOptionalConfig('backend.logger.meta')
    ?.get<JsonObject>();

  const overridesConfig = config.getOptionalConfigArray(
    'backend.logger.overrides',
  );
  const overrides = overridesConfig?.map((override, i) => {
    const overrideLevel = override.getString('level');
    if (winstonLevels[overrideLevel] === undefined) {
      throw new Error(
        `Invalid config at backend.logger.overrides[${i}].level, '${overrideLevel}' is not a valid logging level, must be one of 'error', 'warn', 'info' or 'debug'.`,
      );
    }

    const matchers = override
      .getConfig('matchers')
      .get<WinstonLoggerLevelOverrideMatchers>();

    return {
      matchers,
      level: overrideLevel,
    };
  });

  return {
    meta,
    level,
    overrides,
  };
};
