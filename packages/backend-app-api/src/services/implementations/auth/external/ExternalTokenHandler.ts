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
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { LegacyTokenHandler } from './legacy';
import { StaticTokenHandler } from './static';
import { TokenHandler } from './types';

const NEW_CONFIG_KEY = 'backend.auth.externalAccess';
const OLD_CONFIG_KEY = 'backend.auth.keys';

/**
 * Handles all types of external caller token types (i.e. not Backstage user
 * tokens, nor Backstage backend plugin tokens).
 *
 * @internal
 */
export class ExternalTokenHandler {
  static create(options: {
    config: RootConfigService;
    logger: LoggerService;
  }): ExternalTokenHandler {
    const { config, logger } = options;

    const staticHandler = new StaticTokenHandler();
    const legacyHandler = new LegacyTokenHandler();
    const handlers: Record<string, TokenHandler> = {
      static: staticHandler,
      legacy: legacyHandler,
    };

    // Load the new-style handlers
    const handlerConfigs = config.getOptionalConfigArray(NEW_CONFIG_KEY) ?? [];
    for (const handlerConfig of handlerConfigs) {
      const type = handlerConfig.getString('type');
      const handler = handlers[type];
      if (!handler) {
        const valid = Object.keys(handlers)
          .map(k => `'${k}'`)
          .join(', ');
        throw new Error(
          `Unknown type '${type}' in ${NEW_CONFIG_KEY}, expected one of ${valid}`,
        );
      }
      handler.add(handlerConfig.getConfig('options'));
    }

    // Load the old keys too
    const legacyConfigs = config.getOptionalConfigArray(OLD_CONFIG_KEY) ?? [];
    if (legacyConfigs.length) {
      logger.warn(
        `DEPRECATION WARNING: The ${OLD_CONFIG_KEY} config has been replaced by ${NEW_CONFIG_KEY}, see https://backstage.io/docs/auth/service-to-service-auth`,
      );
    }
    for (const handlerConfig of legacyConfigs) {
      legacyHandler.addOld(handlerConfig);
    }

    return new ExternalTokenHandler(Object.values(handlers));
  }

  constructor(private readonly handlers: TokenHandler[]) {}

  async verifyToken(token: string): Promise<{ subject: string } | undefined> {
    for (const handler of this.handlers) {
      const result = await handler.verifyToken(token);
      if (result) {
        return result;
      }
    }
    return undefined;
  }
}
