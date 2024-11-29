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
  AuthService,
  BackstageCredentials,
  BackstageNonePrincipal,
  BackstagePrincipalTypes,
  BackstageServicePrincipal,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { decodeJwt } from 'jose';
import { ExternalTokenHandler } from './external/ExternalTokenHandler';
import {
  createCredentialsWithNonePrincipal,
  createCredentialsWithServicePrincipal,
  createCredentialsWithUserPrincipal,
  toInternalBackstageCredentials,
} from './helpers';
import { PluginTokenHandler } from './plugin/PluginTokenHandler';
import { PluginKeySource } from './plugin/keys/types';
import { UserTokenHandler } from './user/UserTokenHandler';

/** @internal */
export class DefaultAuthService implements AuthService {
  constructor(
    private readonly userTokenHandler: UserTokenHandler,
    private readonly pluginTokenHandler: PluginTokenHandler,
    private readonly externalTokenHandler: ExternalTokenHandler,
    private readonly pluginId: string,
    private readonly disableDefaultAuthPolicy: boolean,
    private readonly pluginKeySource: PluginKeySource,
  ) {}

  async authenticate(
    token: string,
    options?: {
      allowLimitedAccess?: boolean;
    },
  ): Promise<BackstageCredentials> {
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
      if (
        !options?.allowLimitedAccess &&
        this.userTokenHandler.isLimitedUserToken(token)
      ) {
        throw new AuthenticationError('Illegal limited user token');
      }

      return createCredentialsWithUserPrincipal(
        userResult.userEntityRef,
        token,
        this.#getJwtExpiration(token),
      );
    }

    const externalResult = await this.externalTokenHandler.verifyToken(token);
    if (externalResult) {
      return createCredentialsWithServicePrincipal(
        externalResult.subject,
        undefined,
        externalResult.accessRestrictions,
      );
    }

    throw new AuthenticationError('Illegal token');
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

    // check whether a plugin support the new auth system
    // by checking the public keys endpoint existance.
    switch (type) {
      // TODO: Check whether the principal is ourselves
      case 'service':
        return this.pluginTokenHandler.issueToken({
          pluginId: this.pluginId,
          targetPluginId,
        });
      case 'user': {
        const { token } = internalForward;
        if (!token) {
          throw new Error('User credentials is unexpectedly missing token');
        }
        const onBehalfOf = await this.userTokenHandler.createLimitedUserToken(
          token,
        );
        return this.pluginTokenHandler.issueToken({
          pluginId: this.pluginId,
          targetPluginId,
          onBehalfOf: {
            limitedUserToken: onBehalfOf.token,
            expiresAt: onBehalfOf.expiresAt,
          },
        });
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

  async listPublicServiceKeys(): Promise<{ keys: JsonObject[] }> {
    const { keys } = await this.pluginKeySource.listKeys();
    return { keys: keys.map(({ key }) => key) };
  }

  #getJwtExpiration(token: string) {
    const { exp } = decodeJwt(token);
    if (!exp) {
      throw new AuthenticationError('User token is missing expiration');
    }
    return new Date(exp * 1000);
  }
}
