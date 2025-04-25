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
  createServiceRef,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { LegacyConfigWrapper, LegacyTokenHandler } from './legacy';
import { StaticTokenHandler } from './static';
import { JWKSHandler } from './jwks';
import { TokenHandler } from './types';
import { Config } from '@backstage/config';
import { groupBy } from 'lodash';

const NEW_CONFIG_KEY = 'backend.auth.externalAccess';
const OLD_CONFIG_KEY = 'backend.auth.keys';
let loggedDeprecationWarning = false;

/**
 * @public
 * This service is used to decorate the default plugin token handler with custom logic.
 */
export const externalTokenTypeHandlersRef = createServiceRef<{
  type: string;
  factory: (config: Config[]) => TokenHandler;
}>({
  id: 'core.auth.externalTokenHandlers',
  multiton: true,
  // defaultFactory // :pepe-think: seems like is not possible to use defaultFactory with multiton
});

type TokenTypeHandler = {
  type: string;
  /**
   * A factory function that takes all token configuration for a given type
   * and returns a TokenHandler or an array of TokenHandlers.
   */
  factory: (config: Config[]) => TokenHandler | TokenHandler[];
};
type LegacyTokenTypeHandler = {
  type: 'legacy';
  /**
   * A factory function that takes all token configuration for a given type
   * and returns a TokenHandler or an array of TokenHandlers.
   */
  factory: (
    config: (Config | LegacyConfigWrapper)[],
  ) => TokenHandler | TokenHandler[];
};

const defaultHandlers: (TokenTypeHandler | LegacyTokenTypeHandler)[] = [
  {
    type: 'static',
    factory: configs => new StaticTokenHandler(configs),
  },
  {
    type: 'legacy',
    factory: (configs: (Config | { legacy: true; config: Config })[]) =>
      new LegacyTokenHandler(configs),
  },
  {
    type: 'jwks',
    factory: configs => new JWKSHandler(configs),
  },
];

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
    externalTokenHandlers?: TokenTypeHandler[];
  }): ExternalTokenHandler {
    const {
      ownPluginId,
      config,
      logger,
      externalTokenHandlers: customHandlers,
    } = options;

    const handlersTypes = [...defaultHandlers, ...(customHandlers ?? [])];

    const handlerConfigs = config.getOptionalConfigArray(NEW_CONFIG_KEY) ?? [];
    const handlerConfigByType: Record<string, Config[]> & {
      legacy?: (Config | LegacyConfigWrapper)[];
    } = groupBy(handlerConfigs, (handlerConfig: Config) =>
      handlerConfig.getString('type'),
    );

    // Load the old keys too
    const legacyConfigs = config.getOptionalConfigArray(OLD_CONFIG_KEY) ?? [];

    if (legacyConfigs.length && !loggedDeprecationWarning) {
      loggedDeprecationWarning = true;
      logger.warn(
        `DEPRECATION WARNING: The ${OLD_CONFIG_KEY} config has been replaced by ${NEW_CONFIG_KEY}, see https://backstage.io/docs/auth/service-to-service-auth`,
      );
    }
    for (const handlerConfig of legacyConfigs) {
      handlerConfigByType.legacy ??= [];
      handlerConfigByType.legacy.push({ legacy: true, config: handlerConfig });
    }

    const invalidTypes = Object.keys(handlerConfigByType).filter(
      type => !handlersTypes.some(handler => handler.type === type),
    );

    if (invalidTypes.length > 0) {
      const valid = handlersTypes
        .map(handler => `'${handler.type}'`)
        .join(', ');
      throw new Error(
        `Unknown type(s) '${invalidTypes.join(
          ', ',
        )}' in ${NEW_CONFIG_KEY}, expected one of ${valid}`,
      );
    }

    const handlers = handlersTypes.flatMap(handler => {
      const configs = handlerConfigByType[handler.type] ?? [];
      const handlerInstances = handler.factory(configs);
      if (Array.isArray(handlerInstances)) {
        return handlerInstances;
      }
      return [handlerInstances];
    });

    return new ExternalTokenHandler(ownPluginId, handlers);
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
