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
import { legacyTokenHandler } from './legacy';
import { staticTokenHandler } from './static';
import { jwksTokenHandler } from './jwks';
import { AccessRestrictionsMap, ExternalTokenHandler } from './types';
import { readAccessRestrictionsFromConfig } from './helpers';

const NEW_CONFIG_KEY = 'backend.auth.externalAccess';
const OLD_CONFIG_KEY = 'backend.auth.keys';
let loggedDeprecationWarning = false;

/**
 * @public
 * This service is used to add custom handlers for external token.
 */
export const externalTokenHandlersServiceRef = createServiceRef<
  ExternalTokenHandler<unknown>
>({
  id: 'core.auth.externalTokenHandlers',
  multiton: true,
});

const defaultHandlers: Record<string, ExternalTokenHandler<unknown>> = {
  static: staticTokenHandler,
  legacy: legacyTokenHandler,
  jwks: jwksTokenHandler,
};

type ContextMapEntry<T> = {
  context: T;
  handler: ExternalTokenHandler<T>;
  allAccessRestrictions?: AccessRestrictionsMap;
};

/**
 * Handles all types of external caller token types (i.e. not Backstage user
 * tokens, nor Backstage backend plugin tokens).
 *
 * @internal
 */
export class ExternalAuthTokenHandler {
  static create(options: {
    ownPluginId: string;
    config: RootConfigService;
    logger: LoggerService;
    externalTokenHandlers?: ExternalTokenHandler<unknown>[];
  }): ExternalAuthTokenHandler {
    const {
      ownPluginId,
      config,
      externalTokenHandlers: customHandlers = [],
      logger,
    } = options;

    const handlersTypes = customHandlers.reduce<
      Record<string, ExternalTokenHandler<unknown>>
    >(
      (acc, handler) => {
        if (acc[handler.type]) {
          throw new Error(
            `Duplicate external token handler type '${handler.type}', each handler must have a unique type`,
          );
        }
        acc[handler.type] = handler;
        return acc;
      },
      { ...defaultHandlers },
    );

    const handlerConfigs = config.getOptionalConfigArray(NEW_CONFIG_KEY) ?? [];
    const contexts: ContextMapEntry<unknown>[] = handlerConfigs.map(
      handlerConfig => {
        const type = handlerConfig.getString('type');

        const handler = handlersTypes[type];
        if (!handler) {
          const valid = Object.keys(handlersTypes)
            .map(h => `'${h}'`)
            .join(', ');
          throw new Error(
            `Unknown type '${type}' in ${NEW_CONFIG_KEY}, expected one of ${valid}`,
          );
        }
        return {
          context: handler.initialize({
            options: handlerConfig.getConfig('options'),
          }),
          handler,
          allAccessRestrictions: handlerConfig
            ? readAccessRestrictionsFromConfig(handlerConfig)
            : undefined,
        };
      },
    );

    // Load the old keys too
    const legacyConfigs = config.getOptionalConfigArray(OLD_CONFIG_KEY) ?? [];

    if (legacyConfigs.length && !loggedDeprecationWarning) {
      loggedDeprecationWarning = true;

      logger.warn(
        `DEPRECATION WARNING: The ${OLD_CONFIG_KEY} config has been replaced by ${NEW_CONFIG_KEY}, see https://backstage.io/docs/auth/service-to-service-auth`,
      );
    }

    for (const legacyConfig of legacyConfigs) {
      contexts.push({
        context: legacyTokenHandler.initialize({
          legacy: true,
          options: legacyConfig,
        }),
        handler: legacyTokenHandler,
        allAccessRestrictions: readAccessRestrictionsFromConfig(legacyConfig),
      });
    }

    return new ExternalAuthTokenHandler(ownPluginId, contexts);
  }

  private readonly ownPluginId: string;
  private readonly contexts: {
    context: unknown;
    handler: ExternalTokenHandler<unknown>;
    allAccessRestrictions?: AccessRestrictionsMap;
  }[];

  constructor(
    ownPluginId: string,
    contexts: {
      context: unknown;
      handler: ExternalTokenHandler<unknown>;
      allAccessRestrictions?: AccessRestrictionsMap;
    }[],
  ) {
    this.ownPluginId = ownPluginId;
    this.contexts = contexts;
  }

  async verifyToken(token: string): Promise<
    | {
        subject: string;
        accessRestrictions?: BackstagePrincipalAccessRestrictions;
      }
    | undefined
  > {
    for (const { handler, allAccessRestrictions, context } of this.contexts) {
      const result = await handler.verifyToken(token, context);
      if (result) {
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
            ...result,
            accessRestrictions,
          };
        }

        return result;
      }
    }

    return undefined;
  }
}
