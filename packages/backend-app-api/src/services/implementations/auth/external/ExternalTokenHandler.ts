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
  BackstagePrincipalAccessRestrictions,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { LegacyTokenHandler } from './legacy';
import { StaticTokenHandler } from './static';
import { JWKSHandler } from './jwks';
import { TokenHandler } from './types';

const NEW_CONFIG_KEY = 'backend.auth.externalAccess';
const OLD_CONFIG_KEY = 'backend.auth.keys';
let loggedDeprecationWarning = false;

/**
 * Handles all types of external caller token types (i.e. not Backstage user
 * tokens, nor Backstage backend plugin tokens).
 *
 * @internal
 */
export class ExternalTokenHandler {
  static create(options: {
    ownPluginId: string;
    config: RootConfigService;
    logger: LoggerService;
  }): ExternalTokenHandler {
    const { ownPluginId, config, logger } = options;

    const staticHandler = new StaticTokenHandler();
    const legacyHandler = new LegacyTokenHandler();
    const jwksHandler = new JWKSHandler();
    const handlers: Record<string, TokenHandler> = {
      static: staticHandler,
      legacy: legacyHandler,
      jwks: jwksHandler,
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
      handler.add(handlerConfig);
    }

    // Load the old keys too
    const legacyConfigs = config.getOptionalConfigArray(OLD_CONFIG_KEY) ?? [];
    if (legacyConfigs.length && !loggedDeprecationWarning) {
      loggedDeprecationWarning = true;
      logger.warn(
        `DEPRECATION WARNING: The ${OLD_CONFIG_KEY} config has been replaced by ${NEW_CONFIG_KEY}, see https://backstage.io/docs/auth/service-to-service-auth`,
      );
    }
    for (const handlerConfig of legacyConfigs) {
      legacyHandler.addOld(handlerConfig);
    }

    return new ExternalTokenHandler(ownPluginId, Object.values(handlers));
  }

  constructor(
    private readonly ownPluginId: string,
    private readonly handlers: TokenHandler[],
  ) {}

  async verifyToken(token: string): Promise<
    | {
        subject: string;
        accessRestrictions?: BackstagePrincipalAccessRestrictions;
      }
    | undefined
  > {
    for (const handler of this.handlers) {
      const result = await handler.verifyToken(token);
      if (result) {
        const { allAccessRestrictions, ...rest } = result;
        if (allAccessRestrictions) {
          const accessRestrictions = allAccessRestrictions.get(
            this.ownPluginId,
          );
          if (!accessRestrictions) {
            const valid = [...allAccessRestrictions.keys()]
              .map(k => `'${k}'`)
              .join(', ');
            throw new NotAllowedError(
              `This token's access is restricted to plugin(s) ${valid}`,
            );
          }

          return {
            ...rest,
            accessRestrictions,
          };
        }

        return rest;
      }
    }

    return undefined;
  }
}
