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

import { AuthenticationError } from '@backstage/errors';
import {
  createProxyAuthenticator,
  ProfileInfo,
} from '@backstage/plugin-auth-node';
import { createTokenValidator } from './helpers';
import { OidcProxyResult } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import fetch from 'node-fetch';
import { JwksClient } from './JwksClient';

/**
 * the default http request header used when an alternative header has not been
 * explicitly configured.
 */
export const DEFAULT_OIDC_ID_TOKEN_HEADER = 'x-oidc-id-token';

export function createOidcProxyAuthenticator(logger: LoggerService) {
  return createProxyAuthenticator({
    defaultProfileTransform: async (result: OidcProxyResult) => {
      const profileInfo: ProfileInfo = { email: result.idToken.email };
      if ('name' in result.idToken) {
        profileInfo.displayName = result.idToken.name as string;
      }
      if ('picture' in result.idToken) {
        profileInfo.picture = result.idToken.picture as string;
      }
      logger.debug(
        `oidc proxy profile transform: ${JSON.stringify(profileInfo)}`,
      );
      return { profile: profileInfo };
    },
    initialize({ config }) {
      const iss = config.getString('issuer');
      const aud = config.getString('audience');
      const oidcIdTokenHeader =
        config.getOptionalString('oidcIdTokenHeader') ??
        DEFAULT_OIDC_ID_TOKEN_HEADER;

      // oidc discovery of jwks
      const jwksClient = new JwksClient(async () => {
        return new URL(await discoverJwksUri(iss));
      });

      const tokenValidator = createTokenValidator(logger, iss, aud, jwksClient);

      return { oidcIdTokenHeader, tokenValidator };
    },
    async authenticate({ req }, { oidcIdTokenHeader, tokenValidator }) {
      const token = req.header(oidcIdTokenHeader);

      if (!token || typeof token !== 'string') {
        throw new AuthenticationError(
          `could not authenticate: missing header ${oidcIdTokenHeader}`,
        );
      }

      const idToken = await tokenValidator(token);

      return {
        result: { idToken },
        providerInfo: { idToken },
      };
    },
  });
}

async function discoverJwksUri(iss: string): Promise<string> {
  const resp = await fetch(`${iss}/.well-known/openid-configuration`);
  if (!resp.ok) {
    throw new Error(`could not fetch discovery document: ${resp.statusText}`);
  }
  return resp.json().then(discoveryDocument => {
    if (!discoveryDocument.jwks_uri) {
      throw new Error(
        `missing jwks_uri from ${iss}/.well-known-openid-configuration`,
      );
    }
    return discoveryDocument.jwks_uri;
  });
}
