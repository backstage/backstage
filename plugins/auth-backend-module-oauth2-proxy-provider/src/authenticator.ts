/*
 * Copyright 2023 The Backstage Authors
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
import { createProxyAuthenticator } from '@backstage/plugin-auth-node';
import { decodeJwt } from 'jose';
import { OAuth2ProxyResult } from './types';

/**
 * NOTE: This may come in handy if you're doing work on this provider:
 * plugins/auth-backend/examples/docker-compose.oauth2-proxy.yaml
 *
 * @public
 */
export const OAUTH2_PROXY_JWT_HEADER = 'X-OAUTH2-PROXY-ID-TOKEN';

/** @public */
export const oauth2ProxyAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async (result: OAuth2ProxyResult) => {
    return {
      profile: {
        email: result.getHeader('x-forwarded-email'),
        displayName:
          result.getHeader('x-forwarded-preferred-username') ||
          result.getHeader('x-forwarded-user'),
      },
    };
  },
  async initialize({ config }) {
    const logoutRedirectUrl = config.getOptionalString('logoutRedirectUrl');
    return { logoutRedirectUrl };
  },
  async authenticate({ req }) {
    try {
      // This unpacking of the JWT is just a utility provided by the
      // authenticator to make the fields available to the profile transform and
      // sign-in resolvers. The JWT is already validated by the upstream OAuth2
      // Proxy, and since OAuth2 Proxy doesn't provide a way to authenticate
      // forwarded requests, we don't do any additional validation here but
      // instead trust that there is no way for attackers to bypass the OAuth2
      // Proxy. We could validate these individual ID tokens for some of the
      // upstream providers, but that is currently not in scope for this
      // authenticator.
      const authHeader = req.header(OAUTH2_PROXY_JWT_HEADER);
      const jwt = authHeader?.match(/^Bearer[ ]+(\S+)$/i)?.[1];
      const decodedJWT = jwt && decodeJwt(jwt);

      const result = {
        fullProfile: decodedJWT || {},
        accessToken: jwt || '',
        headers: req.headers,
        getHeader(name: string) {
          if (name.toLocaleLowerCase('en-US') === 'set-cookie') {
            throw new Error('Access Set-Cookie via the headers object instead');
          }
          return req.get(name);
        },
      };

      return {
        result,
        providerInfo: {
          accessToken: result.accessToken,
        },
      };
    } catch (e) {
      throw new AuthenticationError('Authentication failed', e);
    }
  },
  logout({ res }, { logoutRedirectUrl }) {
    if (logoutRedirectUrl && res) {
      return res
        .status(200)
        .json({
          redirectUrl: logoutRedirectUrl,
        })
        .send();
    }
    return res.status(204).send();
  },
});
