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
 * This service is used to decorate the default plugin token handler with custom logic.
 */
export const externalTokenTypeHandlersRef = createServiceRef<
  ExternalTokenHandler<unknown>
>({
  id: 'core.auth.externalTokenHandlers',
  multiton: true,
  // defaultFactory // :pepe-think: seems like is not possible to use defaultFactory with multiton
});

const defaultHandlers: ExternalTokenHandler<unknown>[] = [
  staticTokenHandler,
  legacyTokenHandler,
  jwksTokenHandler,
];

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
      externalTokenHandlers: customHandlers,
    } = options;

    const handlersTypes = [...defaultHandlers, ...(customHandlers ?? [])];

    const handlerConfigs = config.getOptionalConfigArray(NEW_CONFIG_KEY) ?? [];
    const contexts: ContextMapEntry<unknown>[] = handlerConfigs.map(
      handlerConfig => {
        const type = handlerConfig.getString('type');

        const handler = handlersTypes.find(h => h.type === type);
        if (!handler) {
          const valid = handlersTypes.map(h => `'${h.type}'`).join(', ');
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
      // :pepe-think: this message was here for more than a year, and replacing this simplifies things a lot
      throw new Error(
        `The ${OLD_CONFIG_KEY} config has been replaced by ${NEW_CONFIG_KEY}, see https://backstage.io/docs/auth/service-to-service-auth`,
      );
    }

    return new ExternalAuthTokenHandler(ownPluginId, contexts);
  }

  constructor(
    private readonly ownPluginId: string,
    private readonly contexts: {
      context: unknown;
      handler: ExternalTokenHandler<unknown>;
      allAccessRestrictions?: AccessRestrictionsMap;
    }[],
  ) {}

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
