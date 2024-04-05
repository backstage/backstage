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

import { TokenManager } from '@backstage/backend-common';
import {
  AuthService,
  BackstageCredentials,
  BackstagePrincipalTypes,
  BackstageServicePrincipal,
  BackstageNonePrincipal,
  BackstageUserPrincipal,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { decodeJwt } from 'jose';
import { UserTokenHandler } from './UserTokenHandler';
import { PluginTokenHandler } from './PluginTokenHandler';
import { JsonObject } from '@backstage/types';
import { DatabaseKeyStore } from './DatabaseKeyStore';
import { KeyStore } from './types';

/** @internal */
export type InternalBackstageCredentials<TPrincipal = unknown> =
  BackstageCredentials<TPrincipal> & {
    version: string;
    token?: string;
  };

export function createCredentialsWithServicePrincipal(
  sub: string,
  token?: string,
): InternalBackstageCredentials<BackstageServicePrincipal> {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    token,
    principal: {
      type: 'service',
      subject: sub,
    },
  };
}

export function createCredentialsWithUserPrincipal(
  sub: string,
  token: string,
  expiresAt?: Date,
): InternalBackstageCredentials<BackstageUserPrincipal> {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    token,
    expiresAt,
    principal: {
      type: 'user',
      userEntityRef: sub,
    },
  };
}

export function createCredentialsWithNonePrincipal(): InternalBackstageCredentials<BackstageNonePrincipal> {
  return {
    $$type: '@backstage/BackstageCredentials',
    version: 'v1',
    principal: {
      type: 'none',
    },
  };
}

export function toInternalBackstageCredentials(
  credentials: BackstageCredentials,
): InternalBackstageCredentials<
  BackstageUserPrincipal | BackstageServicePrincipal | BackstageNonePrincipal
> {
  if (credentials.$$type !== '@backstage/BackstageCredentials') {
    throw new Error('Invalid credential type');
  }

  const internalCredentials = credentials as InternalBackstageCredentials<
    BackstageUserPrincipal | BackstageServicePrincipal | BackstageNonePrincipal
  >;

  if (internalCredentials.version !== 'v1') {
    throw new Error(
      `Invalid credential version ${internalCredentials.version}`,
    );
  }

  return internalCredentials;
}

/** @internal */
class DefaultAuthService implements AuthService {
  constructor(
    private readonly tokenManager: TokenManager,
    private readonly userTokenHandler: UserTokenHandler,
    private readonly pluginId: string,
    private readonly disableDefaultAuthPolicy: boolean,
    private readonly publicKeyStore: KeyStore,
    private readonly pluginTokenHandler: PluginTokenHandler,
  ) {}

  async listPublicServiceKeys(): Promise<{ keys: JsonObject[] }> {
    const { keys } = await this.publicKeyStore.listKeys();
    return { keys: keys.map(({ key }) => key) };
  }

  // allowLimitedAccess is currently ignored, since we currently always use the full user tokens
  async authenticate(token: string): Promise<BackstageCredentials> {
    const pluginResult = await this.pluginTokenHandler.verifyToken(token);
    if (pluginResult) {
      if (pluginResult.limitedUserToken) {
        const userResult = await this.userTokenHandler.verifyToken(
          pluginResult.limitedUserToken,
        );
        if (!userResult) {
          throw new AuthenticationError(
            'Invalid user token in plugin token obo claim',
          );
        }
        return createCredentialsWithUserPrincipal(
          userResult.userEntityRef,
          pluginResult.limitedUserToken,
          this.#getJwtExpiration(pluginResult.limitedUserToken),
        );
      }
      return createCredentialsWithServicePrincipal(pluginResult.subject);
    }

    const userResult = await this.userTokenHandler.verifyToken(token);
    if (userResult) {
      return createCredentialsWithUserPrincipal(
        userResult.userEntityRef,
        token,
        this.#getJwtExpiration(token),
      );
    }

    // Legacy service-to-service token
    const { sub, aud } = decodeJwt(token);
    if (sub === 'backstage-server' && !aud) {
      await this.tokenManager.authenticate(token);
      return createCredentialsWithServicePrincipal('external:backstage-plugin');
    }

    throw new AuthenticationError('Unknown token');
  }

  isPrincipal<TType extends keyof BackstagePrincipalTypes>(
    credentials: BackstageCredentials,
    type: TType,
  ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]> {
    const principal = credentials.principal as
      | BackstageUserPrincipal
      | BackstageServicePrincipal;

    if (type === 'unknown') {
      return true;
    }

    if (principal.type !== type) {
      return false;
    }

    return true;
  }

  async getNoneCredentials(): Promise<
    BackstageCredentials<BackstageNonePrincipal>
  > {
    return createCredentialsWithNonePrincipal();
  }

  async getOwnServiceCredentials(): Promise<
    BackstageCredentials<BackstageServicePrincipal>
  > {
    return createCredentialsWithServicePrincipal(`plugin:${this.pluginId}`);
  }

  async getPluginRequestToken(options: {
    onBehalfOf: BackstageCredentials;
    targetPluginId: string;
  }): Promise<{ token: string }> {
    const { targetPluginId } = options;
    const internalForward = toInternalBackstageCredentials(options.onBehalfOf);
    const { type } = internalForward.principal;

    // Since disabling the default policy means we'll be allowing
    // unauthenticated requests through, we might have unauthenticated
    // credentials from service calls that reach this point. If that's the case,
    // we'll want to keep "forwarding" the unauthenticated credentials, which we
    // do by returning an empty token.
    if (type === 'none' && this.disableDefaultAuthPolicy) {
      return { token: '' };
    }

    const targetSupportsNewAuth =
      await this.pluginTokenHandler.isTargetPluginSupported(targetPluginId);

    // check whether a plugin support the new auth system
    // by checking the public keys endpoint existance.
    switch (type) {
      // TODO: Check whether the principal is ourselves
      case 'service':
        if (targetSupportsNewAuth) {
          return this.pluginTokenHandler.issueToken({
            pluginId: this.pluginId,
            targetPluginId,
          });
        }
        // If the target plugin does not support the new auth service, fall back to using old token format
        return this.tokenManager.getToken();
      case 'user': {
        const { token } = internalForward;
        if (!token) {
          throw new Error('User credentials is unexpectedly missing token');
        }
        // If the target plugin supports the new auth service we issue a service
        // on-behalf-of token rather than forwarding the user token
        if (targetSupportsNewAuth) {
          const onBehalfOf = await this.userTokenHandler.createLimitedUserToken(
            token,
          );
          return this.pluginTokenHandler.issueToken({
            pluginId: this.pluginId,
            targetPluginId,
            onBehalfOf,
          });
        }

        if (this.userTokenHandler.isLimitedUserToken(token)) {
          throw new AuthenticationError(
            `Unable to call '${targetPluginId}' plugin on behalf of user, because the target plugin does not support on-behalf-of tokens`,
          );
        }
        return { token };
      }
      default:
        throw new AuthenticationError(
          `Refused to issue service token for credential type '${type}'`,
        );
    }
  }

  async getLimitedUserToken(
    credentials: BackstageCredentials<BackstageUserPrincipal>,
  ): Promise<{ token: string; expiresAt: Date }> {
    const { token: backstageToken } =
      toInternalBackstageCredentials(credentials);
    if (!backstageToken) {
      throw new AuthenticationError(
        'User credentials is unexpectedly missing token',
      );
    }

    return this.userTokenHandler.createLimitedUserToken(backstageToken);
  }

  #getJwtExpiration(token: string) {
    const { exp } = decodeJwt(token);
    if (!exp) {
      throw new AuthenticationError('User token is missing expiration');
    }
    return new Date(exp * 1000);
  }
}

/** @public */
export const authServiceFactory = createServiceFactory({
  service: coreServices.auth,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
    discovery: coreServices.discovery,
    plugin: coreServices.pluginMetadata,
    database: coreServices.database,
    // Re-using the token manager makes sure that we use the same generated keys for
    // development as plugins that have not yet been migrated. It's important that this
    // keeps working as long as there are plugins that have not been migrated to the
    // new auth services in the new backend system.
    tokenManager: coreServices.tokenManager,
  },

  async factory({ config, discovery, plugin, tokenManager, logger, database }) {
    const disableDefaultAuthPolicy = Boolean(
      config.getOptionalBoolean(
        'backend.auth.dangerouslyDisableDefaultAuthPolicy',
      ),
    );

    const publicKeyStore = await DatabaseKeyStore.create({ database });

    return new DefaultAuthService(
      tokenManager,
      new UserTokenHandler({ discovery }),
      plugin.getId(),
      disableDefaultAuthPolicy,
      publicKeyStore,
      PluginTokenHandler.create({
        ownPluginId: plugin.getId(),
        keyDurationSeconds: 60 * 60,
        logger,
        publicKeyStore,
        discovery,
      }),
    );
  },
});
